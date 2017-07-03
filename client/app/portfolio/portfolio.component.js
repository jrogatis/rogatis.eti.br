import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './portfolio.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import angularGrid from 'angulargrid';

export class PortfolioController {
  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, ngMeta, $location) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    this.ngMeta = ngMeta;
    this.$location = $location;
  }

  $onInit() {
    this.$http.get('/api/projects')
      .then(response => {
        this.ngMeta.setTitle('Jean Philip de Rogatis Code Porfolio');
        this.ngMeta.setTag('og:title', 'Jean Philip de Rogatis  Code Porfolio');
        this.ngMeta.setTag('description', 'My code war! Some exemple of my battles!');
        this.ngMeta.setTag('og:description', 'My code war! Some exemple of my battles!');
        this.ngMeta.setTag('og:url', this.$location.absUrl());
        this.ngMeta.setTag('og:image', 'https://s3.amazonaws.com/rogatis/anxiusbw.jpg');
        this.listProjects = response.data;
        this.socket.syncUpdates('projects', this.listProjects);
      });
  }
}

export default angular.module('rogatisEtiBrApp.portfolio', [ngRoute, ngMdIcons, ngMessages, ngAria, angularGrid, 'ngMeta'])
  .config(routing)
  .component('portfolio', {
    template: require('./portfolio.pug'),
    controller: PortfolioController
  })
  .name;
