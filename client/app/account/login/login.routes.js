'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/login', {
    template: '<login></login>'
  });
}
