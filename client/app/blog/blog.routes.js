'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/blog', {
    template: '<blog></blog>'
  });
}
