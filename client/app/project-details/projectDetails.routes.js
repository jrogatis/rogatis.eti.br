'use strict';
export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/projectDetails/:projectId', {
    template: '<projectDetails></projectDetails>'
  });
}
