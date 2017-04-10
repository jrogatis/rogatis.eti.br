'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/editorProjectDetails', {
    template: '<editor-project-details></editor-project-details>',
    authenticate: true
  });
}
