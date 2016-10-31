'use strict';
export default function routes($routeProvider, ngMetaProvider) {
  'ngInject';

  $routeProvider.when('/post/:postId', {
    template: '<post></post>',
    data: {
      meta: {
        'title': 'This are my posts at Jean Philip de Rogatis Blog',
        'description': 'Some of my post at www.rogatis.et.br/blog'
      }
    }
  });
}
