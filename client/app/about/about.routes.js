'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/about', {
    template: '<about></about>'
  });
}
