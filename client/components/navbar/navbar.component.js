'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import angularAria from 'angular-aria';
import ngAnimate from 'angular-animate';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';

export class NavbarComponent {
  constructor($location, $mdSidenav, $animate, $scope, Auth, $timeout) {
    'ngInject';
    $scope.pageClass = 'pageNavbar';
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$animate = $animate;
    this.enterState = true;
    this.myCssVar = 'animated fadeInDown';
    this.$timeout(() => {
      this.myCssVar = '';
    }, 1000);
  }

  isActive(route) {
    return route === this.$location.path();
  }

  animate() {
    this.myCssVar = 'animated fadeInDown';
    this.$timeout(() => {
      this.myCssVar = '';
    }, 1000);
  }
}

export default angular.module('directives.navbar', [angularAria, ngAnimate, angularMaterial, angularMessages])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  })
  .name;
