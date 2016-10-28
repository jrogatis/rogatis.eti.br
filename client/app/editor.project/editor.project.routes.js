'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/editorProject', {
    template: '<editorProject></editorProject>'
  });
}
