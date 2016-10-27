'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/gallery', {
    template: '<gallery></gallery>'
  });
}
