'use strict';

export default function routes($routeProvider, ngMetaProvider) {
  'ngInject';

  $routeProvider.when('/', {
    template: '<main></main>',
    data: {
      meta: {
        description: 'This are my personal portofio! Show of some of my work as a code warrior!'
      }
    }
  });
}
