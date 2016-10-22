import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';
import angularGrid from 'angulargrid';

export class MainController {

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('projects');
    });
  }

  $onInit() {
    this.$http.get('/api/projects')
      .then(response => {
        this.listImportantProjects = response.data;
        this.socket.syncUpdates('projects', this.listImportantProjects);
      });
  }
}


export default angular.module('rogatisEtiBrApp.main', [ngRoute, angularGrid])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
