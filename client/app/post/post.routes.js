'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/post/:postId', {
    template: '<post></post>'
  });
}
