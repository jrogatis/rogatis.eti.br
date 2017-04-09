'use strict';

const angular = require('angular');

angular.module('socketMock', [])
  .factory('socket', () => {
    return {
      socket: {
        connect() {},
        on() {},
        emit() {},
        receive() {}
      },

      syncUpdates() {},
      unsyncUpdates() {}
    };
  });
