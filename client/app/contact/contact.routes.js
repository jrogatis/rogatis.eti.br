'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/contact', {
    template: '<contact></contact>'
  });
}
