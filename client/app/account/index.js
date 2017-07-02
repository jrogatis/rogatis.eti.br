'use strict';

import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './account.routes';
import login from './login';
import settings from './settings';
import signup from './signup';

export default angular.module('rogatisEtiBrApp.account', [ngRoute, login, settings, signup])
.config(routing)
.run($rootScope => {
  'ngInject';

  $rootScope.$on('$routeChangeStart', (event, next, current) => {
    if (next.name === 'logout' && current && current.originalPath && !current.authenticate) {
      next.referrer = current.originalPath;
    }
  });
})
.name;
