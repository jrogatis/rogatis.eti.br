'use strict';
export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/projectDetails/:projectId', {
    template: '<project-details></project-details>'
  });
}
