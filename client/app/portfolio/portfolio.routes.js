'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/portfolio', {
    template: '<portfolio></portfolio>'
  });
}
