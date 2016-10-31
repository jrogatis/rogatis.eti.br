'use strict';

export default function routes($routeProvider, ngMetaProvider) {
  'ngInject';

  $routeProvider.when('/', {
    template: '<main></main>',
    data: {
      meta: {
        'title': 'Jean Philip de Rogatis code warrior portfolio ',
        'description': 'This are my personal portofio! Show of some of my work as a code warrior!',
        'image': 'https://s3.amazonaws.com/rogatis/skydive6.jpg'
      }
    }
  });
}
