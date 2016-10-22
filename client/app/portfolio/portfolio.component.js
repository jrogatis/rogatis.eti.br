import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './portfolio.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import angularGrid from 'angulargrid';

export class PortfolioController {

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

export default angular.module('rogatisEtiBrApp.portfolio', [ngRoute, ngMdIcons, ngMessages, ngAria])
  .config(routing)
  .component('portfolio', {
    template: require('./portfolio.pug'),
    controller: PortfolioController
  })
  .name;
