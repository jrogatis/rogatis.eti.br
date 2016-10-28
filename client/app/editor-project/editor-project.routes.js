'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/editorProject', {
    template: '<editor-project></editor-project>'
  });
}
