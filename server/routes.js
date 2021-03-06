/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import sslRedirect from 'heroku-ssl-redirect';

export default function(app) {
  // Insert routes below
  app.use(sslRedirect());
  app.use('/api/users', require('./api/user'));
  app.use('/api/contactForm', require('./api/contactForm'));
  app.use('/api/projects', require('./api/projects'));
  app.use('/api/posts', require('./api/posts'));
  app.use('/api/imageGallery', require('./api/imageGallery'));
  app.use('/api/sysInfo', require('./api/sysInfo'));
  app.use('/sitemap.xml', require('./api/sitemap'));
  app.use('/api/pageInfos', require('./api/pageInfos'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
