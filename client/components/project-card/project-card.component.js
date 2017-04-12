'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import angularAria from 'angular-aria';
import angularMaterial from 'angular-material';

export class ProjectCardComponent {
  'ngInject';
  constructor($scope, $log) {
    this.$scope = $scope;
    this.$log = $log;
    this.$scope.project = this.project;
    this.$scope.target = 'blank';
    if(this.$scope.project.hasDesc) {
      this.$scope.project.siteUrl = `/projectDetails/${this.$scope.project.slug}`;
      this.$scope.target = '_self';
    }
  }
}

ProjectCardComponent.$inject = ['$scope', '$log'];
export default angular.module('directives.projectCard', [angularAria, angularMaterial])
  .component('projectCard', {
    bindings: {
      project: '='
    },
    template: require('./project-card.pug'),
    controller: ProjectCardComponent,
  })
  .name;
