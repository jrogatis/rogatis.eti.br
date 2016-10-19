'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import angularAria from 'angular-aria';
import angularAnimate from 'angular-animate';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';

export class NavbarComponent {

  constructor($location, $mdSidenav, $animate, $scope) {
    'ngInject';
    $scope.pageClass = 'pageNavbar';
    this.$location = $location;
    this.$scope = $scope;

  }

  isActive(route) {
    return route === this.$location.path();
  }

}

export default angular.module('directives.navbar',[angularAria, angularAnimate, angularMaterial, angularMessages])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  }).name;
