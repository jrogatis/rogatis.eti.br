'use strict';

export function routeConfig($routeProvider, $locationProvider) {
  'ngInject';

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
}

export function logConfig($logProvider) {
  'ngInject';

  $logProvider.debugEnabled(true);
}
