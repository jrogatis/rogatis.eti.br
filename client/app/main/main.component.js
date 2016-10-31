import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';
import angularGrid from 'angulargrid';
import ngMeta from 'ng-meta';

export class MainController {

  /*@ngInject*/
  constructor($http, $scope, socket, ngMeta) {
    this.$http = $http;
    this.socket = socket;
     this.ngMeta = ngMeta;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('projects');
    });
  }

  $onInit() {
    this.$http.get('/api/projects')
      .then(response => {
        this.listProjects = response.data;
        this.listImportantProjects = this.listProjects.filter(el => {
          return el.displayFront === true;
        });
        this.socket.syncUpdates('projects', this.listProjects);
      });
  }
}


export default angular.module('rogatisEtiBrApp.main', [ngRoute, angularGrid, 'ngMeta'])
  .config(routing)
  .run(['ngMeta', function(ngMeta) {
    ngMeta.init();
  }])
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
