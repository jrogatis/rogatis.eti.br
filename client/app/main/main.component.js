import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';
import angularGrid from 'angulargrid';

export class MainController {

  /*@ngInject*/
  constructor($http, $scope, socket, ngMeta, $location) {
    this.$http = $http;
    this.socket = socket;
    this.ngMeta = ngMeta;
    this.$location = $location;
    $scope.$on('$destroy', () => socket.unsyncUpdates('projects'));
  }
  $onInit() {
    this.ngMeta.setTitle('Jean Philip de Rogatis Portfolio');
    this.ngMeta.setTag('og:title', 'Jean Philip de Rogatis Portfolio');
    this.ngMeta.setTag('description', 'This are my personal portofio! Show of some of my work as a code warrior!');
    this.ngMeta.setTag('og:description', 'This are my personal portofio! Show of some of my work as a code warrior!');
    this.ngMeta.setTag('og:url', this.$location.absUrl());
    this.ngMeta.setTag('og:image', 'https://s3.amazonaws.com/rogatis/skydive6.jpg');
    this.ngMeta.setTag('og:type', 'website');
    this.$http.get('/api/projects')
      .then(response => {
        this.listProjects = response.data;
        this.listImportantProjects = this.listProjects.filter(el => el.displayFront === true);
        this.socket.syncUpdates('projects', this.listProjects);
      });
  }
}

export default angular.module('rogatisEtiBrApp.main', [ngRoute, angularGrid, 'ngMeta'])
  .config(routing)
  .run(['ngMeta', ngMeta => ngMeta.init()])
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
