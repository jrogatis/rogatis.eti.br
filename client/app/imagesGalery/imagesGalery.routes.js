'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/imagesGalery', {
    template: '<imagesGalery></imagesGalery>'
  });
}
