'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/admin', {
    template: '<admin></admin>'
  });
}
