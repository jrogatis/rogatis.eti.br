'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import angularAria from 'angular-aria';
import ngAnimate from 'angular-animate';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';

export class SocialShareComponent {
  constructor($location, $mdSidenav, $animate, $scope, Auth) {
    'ngInject';
    $scope.pageClass = 'pageNavbar';
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$scope = $scope;
    this.enterState = true;
  }

  isActive(route) {
    return route === this.$location.path();
  }
}

export default angular.module('directives.SocialShare', [angularAria, ngAnimate, angularMaterial, angularMessages])
  .component('SocialShare', {
    template: require('./social-share.pug'),
    controller: SocialShareComponent
  }).name;
