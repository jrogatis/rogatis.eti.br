// Generated on 2016-10-17 using generator-angular-fullstack 4.1.0
'use strict';

import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import grunt from 'grunt';
import path from 'path';
import through2 from 'through2';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import open from 'open';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import runSequence from 'run-sequence';
import { webdriver_update } from 'gulp-protractor';
import webpack from 'webpack-stream';
import makeWebpackConfig from './webpack.make';
import { EventEmitter } from 'events';
import manifest from 'gulp-manifest';

const eventEmitter = new EventEmitter();

const plugins = gulpLoadPlugins();
let config;

const clientPath = 'client';
const serverPath = 'server';
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    revManifest: `${clientPath}/assets/rev-manifest.json`,
    scripts: [
      `${clientPath}/**/!(*.spec|*.mock).js`
    ],
    styles: [`${clientPath}/{app,components}/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    views: `${clientPath}/{app,components}/**/*.pug`,
    mainView: `${clientPath}/index.html`,
    test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
    e2e: ['e2e/**/*.spec.js']
  },
  server: {
    scripts: [
      `${serverPath}/**/!(*.spec|*.integration).js`,
      `!${serverPath}/config/local.env.sample.js`
    ],
    json: [`${serverPath}/**/*.json`],
    test: {
      integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
      unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
    }
  },
  karma: 'karma.conf.js',
  dist: 'dist'
};

/********************
 * Helper functions
 ********************/

const onServerLog = log => {
  console.log(plugins.util.colors.white('[')
    + plugins.util.colors.yellow('nodemon')
    + plugins.util.colors.white('] ')
    + log.message);
};

const checkAppReady = cb => {
  const options = {
    host: 'localhost',
    port: config.port
  };
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
};

// Call page until first success
const whenServerReady = cb => {
  let serverReady = false;
  const appReadyInterval = setInterval(() =>
    checkAppReady(ready => {
      if (!ready || serverReady) {
        return;
      }
      clearInterval(appReadyInterval);
      serverReady = true;
      cb();
    }),
  100);
};

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()
  .pipe(plugins.eslint, `${clientPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

let lintServerScripts = lazypipe()
  .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

let transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: [
      'transform-class-properties',
      'transform-runtime'
    ]
  })
  .pipe(plugins.sourcemaps.write, '.');

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
  let localConfig;
  try {
    localConfig = require(`./${serverPath}/config/local.env`);
  } catch (e) {
    console.log('error', e);
    localConfig = {};
  }
  plugins.env({
    vars: localConfig
  });
});

gulp.task('env:prod', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'production'
    }
  });
});

/********************
 * Tasks
 ********************/

gulp.task('inject', cb => {
  runSequence(['inject:scss'], cb);
});

gulp.task('inject:scss', () => gulp.src(paths.client.mainStyle)
  .pipe(plugins.inject(
    gulp.src(_.union(paths.client.styles, [`!${paths.client.mainStyle}`]), {
      read: false
    })
      .pipe(plugins.sort()), {
      transform: filepath => {
        let newPath = filepath
          .replace(`/${clientPath}/app/`, '')
          .replace(`/${clientPath}/components/`, '../components/')
          .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
          .replace('.scss', '');
        return `@import '${newPath}';`;
      }
    }))
  .pipe(gulp.dest(`${clientPath}/app`))
);

gulp.task('webpack:dev', () => {
  const webpackDevConfig = makeWebpackConfig({
    ANALYSE_PACK: process.env.ANALYSE_PACK,
    DEV: true
  });
  return gulp.src(webpackDevConfig.entry.app)
    .pipe(plugins.plumber())
    .pipe(webpack(webpackDevConfig, require('webpack')))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('webpack:dist', () => {
  const webpackDistConfig = makeWebpackConfig({
    BUILD: true
  });
  return gulp.src(webpackDistConfig.entry.app)
    .pipe(webpack(webpackDistConfig, require('webpack')))
    .on('error', err => {
      console.log('err no webpackDistConfig', err);
      eventEmitter.emit('end'); // Recover from errors
    })
    .pipe(gulp.dest(`${paths.dist}/client`));
});

gulp.task('styles', () => gulp.src(paths.client.mainStyle)
  .pipe(styles())
  .pipe(gulp.dest('.tmp/app'))
);

gulp.task('transpile:server', () => gulp.src(_.union(paths.server.scripts, paths.server.json))
  .pipe(transpileServer())
  .pipe(gulp.dest(`${paths.dist}/${serverPath}`))
);

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => gulp.src(_.union(
  paths.client.scripts,
  _.map(paths.client.test, blob => `!${blob}`)
))
  .pipe(lintClientScripts())
);

gulp.task('lint:scripts:server', () => gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => `!${  blob}`)))
  .pipe(lintServerScripts())
);

gulp.task('jscs', () => gulp.src(_.union(paths.client.scripts, paths.server.scripts))
  .pipe(plugins.jscs())
  .pipe(plugins.jscs.reporter())
);

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {
  dot: true
}));

gulp.task('start:client', cb => {
  whenServerReady(() => {
    open(`http://localhost:${  config.browserSyncPort}`);
    cb();
  });
});

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} ${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./${paths.dist}/${serverPath}/config/environment`);
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('start:inspector', () => {
  gulp.src([])
    .pipe(plugins.nodeInspector({
      debugPort: 5858
    }));
});

gulp.task('start:server:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('watch', () => {
  const testFiles = _.union(paths.client.test, paths.server.test.unit, paths.server.test.integration);

  plugins.watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts());

  plugins.watch(_.union(paths.server.test.unit, paths.server.test.integration))
    .pipe(plugins.plumber());
});

gulp.task('serve', cb => {
  runSequence(
    [
      'clean:tmp',
      'lint:scripts',
      'inject',
      'copy:fonts:dev',
      'env:all'
    ],
    'webpack:dev',
    ['start:server', 'start:client'],
    'watch',
    cb
  );
});

gulp.task('serve:debug', cb => {
  runSequence(
    [
      'clean:tmp',
      'lint:scripts',
      'inject',
      'copy:fonts:dev',
      'env:all'
    ],
    'webpack:dev',
    'start:inspector', ['start:server:debug', 'start:client'],
    'watch',
    cb
  );
});

gulp.task('serve:dist', cb => {
  runSequence(
    'build',
    'env:all',
    'env:prod', ['start:server:prod', 'start:client'],
    cb);
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp'
    ],
    'inject',
    'transpile:server', [
      'build:images'
    ], [
      'copy:extras',
      'copy:assets',
      'copy:fonts:dist',
      'copy:server',
      'webpack:dist'
    ],
    'revReplaceWebpack',
    'manifest',
    cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {
  dot: true
}));

gulp.task('build:images', () => gulp.src(paths.client.images)
  .pipe(plugins.imagemin([
    plugins.imagemin.optipng({
      optimizationLevel: 5
    }),
    plugins.imagemin.jpegtran({
      progressive: true
    }),
    plugins.imagemin.gifsicle({
      interlaced: true
    }),
    plugins.imagemin.svgo({
      plugins: [{
        removeViewBox: false
      }]
    })
  ], [{
    verbose: true,
  }
  ]))
  .pipe(plugins.rev())
  .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
  .pipe(plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
    base: `${paths.dist}/${clientPath}/assets`,
    merge: true
  }))
  .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`))
);

gulp.task('revReplaceWebpack', () => gulp.src('dist/client/app.*.js')
  .pipe(plugins.revReplace({
    manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)
  }))
  .pipe(gulp.dest('dist/client'))
);

gulp.task('copy:extras', () => gulp.src([
  `${clientPath}/favicon.ico`,
  `${clientPath}/robots.txt`,
  `${clientPath}/.htaccess`,
  `${clientPath}/android-icon-192x192.png`,
  `${clientPath}/manifest.json`,
], {
  dot: true
})
  .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
);

/**
 * turns 'boostrap/fonts/font.woff' into 'boostrap/font.woff'
 */
function flatten() {
  return through2.obj(function(file, enc, next) {
    if (!file.isDirectory()) {
      try {
        let dir = path.dirname(file.relative).split(path.sep)[0];
        let fileName = path.normalize(path.basename(file.path));
        file.path = path.join(file.base, path.join(dir, fileName));
        this.push(file);
      } catch (e) {
        eventEmitter.emit('error', new Error(e));
      }
    }
    next();
  });
}

gulp.task('copy:fonts:dev', () => gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
  .pipe(flatten())
  .pipe(gulp.dest(`${clientPath}/assets/fonts`))
);

gulp.task('copy:fonts:dist', () => gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
  .pipe(flatten())
  .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`))
);

gulp.task('copy:assets', () => gulp.src([paths.client.assets, `!${paths.client.images}`])
  .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`))
);

gulp.task('copy:server', () => gulp.src(['package.json'], { cwdbase: true })
  .pipe(gulp.dest(paths.dist))
);


gulp.task('manifest', () => {
  gulp.src(['dist/client/*'], { base: './' })
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
    }))
    .pipe(gulp.dest('dist'));
});
/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
  buildcontrol: {
    options: {
      dir: paths.dist,
      commit: true,
      push: true,
      connectCommits: false,
      message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
    },
    heroku: {
      options: {
        remote: 'heroku',
        branch: 'master'
      }
    },
    openshift: {
      options: {
        remote: 'openshift',
        branch: 'master'
      }
    }
  }
});

grunt.loadNpmTasks('grunt-build-control');

gulp.task('buildcontrol:heroku', done => {
  grunt.tasks(
    ['buildcontrol:heroku'], //you can add more grunt tasks in this array
    {
      gruntfile: false
    }, //don't look for a Gruntfile - there is none. :-)
    () => {
      done();
    }
  );
});
gulp.task('buildcontrol:openshift', done => {
  grunt.tasks(
    ['buildcontrol:openshift'], //you can add more grunt tasks in this array
    {
      gruntfile: false
    }, //don't look for a Gruntfile - there is none. :-)
    () => {
      done();
    }
  );
});
