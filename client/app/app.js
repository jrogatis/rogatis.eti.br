'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';
const ngRoute = require('angular-route');

import uiBootstrap from 'angular-ui-bootstrap';

import { routeConfig, logProvider } from './app.config';
import _Auth from '../components/auth/auth.module';
import account from './account';
import navbar from '../components/navbar/navbar.component';
import socialShare from '../components/social-share/social-share.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import contact from './contact/contact.component';
import portfolio from './portfolio/portfolio.component';
import blog from './blog/blog.component';
import post from './post/post.component';
import editor from './editor/editor.component';
import gallery from './gallery/gallery.component';
import editorProject from './editor-project/editor-project.component';
import editorProjectDetails from './editor-project-details/editor-project-details.component';
import projectDetails from './project-details/project-details.component';
import about from './about/about.component';
import constants from './app.constants';
import projectCard from '../components/project-card/project-card.component';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import ngMeta from 'ng-meta';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();
import './app.scss';

angular.module('rogatisEtiBrApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', ngRoute, account,
  uiBootstrap, _Auth, navbar, socialShare, footer, main, contact, portfolio, blog, post, editor, gallery, editorProject,
  about, editorProjectDetails, projectDetails, constants, socket, util, 'ngMeta', projectCard
])
  .config(routeConfig, logProvider)
  .run(($rootScope, $location, Auth) => {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', (event, next) => {
      Auth.isLoggedIn(loggedIn => {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['rogatisEtiBrApp'], {
      strictDi: true
    });
  });
