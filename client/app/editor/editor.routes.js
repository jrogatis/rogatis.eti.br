'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/editor', {
    template: '<editor></editor>'
  });
}
