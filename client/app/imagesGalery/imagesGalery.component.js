import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './imagesGalery.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import angularGrid from 'angulargrid';

export class ImagesGaleryController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    this.$http.get('/api/projects')
      .then(response => {
        this.listProjects = response.data;
        this.socket.syncUpdates('projects', this.listProjects);
      });
  }

}

export default angular.module('rogatisEtiBrApp.imagesGalery', [ngRoute, ngMdIcons, ngMessages, ngAria, angularGrid])
  .config(routing)
  .component('imagesGalery', {
    template: require('./imagesGalery.pug'),
    controller: ImagesGaleryController
  })
  .name;
