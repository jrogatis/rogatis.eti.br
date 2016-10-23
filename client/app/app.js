'use strict';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';
const ngRoute = require('angular-route');

import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';


import {
  routeConfig
} from './app.config';

import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import contact from './contact/contact.component';
import portfolio from './portfolio/portfolio.component';
import blog from './blog/blog.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import './app.scss';

angular.module('rogatisEtiBrApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', ngRoute,
    uiBootstrap, navbar, footer, main, contact, portfolio, blog, constants, socket, util
  ])
  .config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['rogatisEtiBrApp'], {
      strictDi: true
    });
  });
