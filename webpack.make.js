'use strict';
/*eslint-env node*/
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const WebpackAssetsManifest = require('webpack-assets-manifest');
const path = require('path');
const OfflinePlugin = require('offline-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = function makeWebpackConfig(options) {
  console.log('webpack opt', options);
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  const BUILD = !!options.BUILD;
  const TEST = !!options.TEST;
  const E2E = !!options.E2E;
  const DEV = !!options.DEV;

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  let config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = {
    app: './client/app/app.js',
    polyfills: './client/polyfills.js',
    vendor: [
      'angular',
      'angular-animate',
      'angular-aria',
      'angular-cookies',
      'angular-resource',
      'angular-route',
      'angular-sanitize',
      'angular-socket-io',
      'angular-ui-bootstrap',
      'angular-material',
      'nvd3',
      'd3',
      'lodash',
      'angular-material-icons',
      'textangular',
      'ng-file-upload',
      'angular-nvd3'
    ]
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = {
    // Absolute output directory
    path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: BUILD || DEV || E2E ? '/' : `http://localhost:${8080}/`,
    //publicPath: BUILD ? '/' : 'http://localhost:' + env.port + '/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
  };

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    rules: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      use: [{
        loader: 'babel-loader', options: {
          shouldPrintComment(commentContents) {
            // keep `/*@ngInject*/`
            return /@ngInject/.test(commentContents);
          }
        },
      }],
      include: [
        path.resolve(__dirname, 'client/'),
        path.resolve(__dirname, 'node_modules/lodash-es/')
      ]
    }, {
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
      use: [
        { loader: 'file-loader' },
        {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 4,
            },
            pngquant: {
              quality: '75-90',
              speed: 3,
            },
          },
        },
      ],
    }, {
      // Pug HTML LOADER
      // Reference: https://github.com/willyelm/pug-html-loader
      // Allow loading Pug throw js
      test: /\.(jade|pug)$/,
      use: 'pug-html-loader'
    }, {

      // CSS LOADER
      // Reference: https://github.com/webpack/css-loader
      // Allow loading css through js
      //
      // Reference: https://github.com/postcss/postcss-loader
      // Postprocess your css with PostCSS plugins
      test: /\.css$/,
     
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files in production builds
      //
      // Reference: https://github.com/webpack/style-loader
      // Use style-loader in development for hot-loading
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css?sourceMap!postcss'
        }]
      })
    }, {
      // SASS LOADER
      // Reference: https://github.com/jtangelder/sass-loader
      test: /\.(scss|sass)$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader', options: {
          outputStyle: 'compressed',
          precision: 10,
          sourceComments: false
        }
      }],
      include: [
        path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
        path.resolve(__dirname, 'client/app/app.scss')
      ]
    }, {
      enforce: 'post',
      test: /\.js$/,
      use: 'ng-annotate-loader?single_quotes'
    }]
  };

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [

    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({filename: '[name].[hash].css',
      disable: !BUILD || TEST
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      //filename: 'vendor.[hash].js',
      filename: 'vendor.js',
      // (Give the chunk a different name)

      minChunks: Infinity
      // (with more entries, this ensures that no other module
      //  goes into the vendor chunk)
    }),
  ];

  // Skip rendering index.html in test mode
  // Reference: https://github.com/ampedandwired/html-webpack-plugin
  // Render index.html
  let htmlConfig = {
    template: 'client/_index.html',
    filename: '../client/index.html',
    alwaysWriteToDisk: true
  };
  config.plugins.push(
    new HtmlWebpackPlugin(htmlConfig),
    new HtmlWebpackHarddiskPlugin()
  );

  // Add build specific plugins
  if(BUILD) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }),

      // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })
    );
  }

  if(options.ANALYSE_PACK === 'true') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    );
  }

  if(DEV) {
    config.plugins.push(
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // Define free global variables
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"'
        }
      }),
    );
  }

  // FINAL PUSH to plugins
  config.plugins.push(
    new OfflinePlugin(),
    new WebpackAssetsManifest({
      done(manifest) {
        console.log(`The manifest has been written to ${manifest.getOutputPath()}`);
      },
      apply(manifest) {
        manifest.set('short_name', 'JPFolio');
        manifest.set('name', 'rogatis.eti.br');
        manifest.set('background_color', '#DADADA');
        manifest.set('theme_color', '#A7A6FB');
      },
      merge: true
    }),
  );

  config.cache = DEV;

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './client/',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  };

  config.node = {
    global: true,
    process: true,
    crypto: 'empty',
    clearImmediate: false,
    setImmediate: false
  };

  return config;
};
