'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import angularAria from 'angular-aria';
import angularMaterial from 'angular-material';

export class ProjectCardComponent {
}

export default angular.module('directives.projectCard', [angularAria, angularMaterial])
  .component('projectCard', {
    template: require('./project-card.pug'),
    controller: ProjectCardComponent
  })
  .name;
