'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import angularAria from 'angular-aria';
import ngAnimate from 'angular-animate';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';

export class NavbarComponent {
  constructor($location, $mdSidenav, $animate, $scope, Auth) {
    'ngInject';
    $scope.pageClass = 'pageNavbar';
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$scope = $scope;
    this.$animate = $animate;
    this.enterState = true;
    /*this.$animate.on('enter', 'navbar',
      function callback(element, phase) {
        // cool we detected an enter animation within the container
        console.log('entao')
      }
    );*/


  }


  isActive(route) {
    return route === this.$location.path();
  }
}

export default angular.module('directives.navbar', [angularAria, ngAnimate, angularMaterial, angularMessages])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  }).name;
