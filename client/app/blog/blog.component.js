import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './blog.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';

export class BlogController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    this.$http.get('/api/posts')
      .then(response => {
        this.listPosts = response.data;
        this.socket.syncUpdates('posts', this.listPosts);
      });
  }
}

export default angular.module('rogatisEtiBrApp.blog', [ngRoute, ngMdIcons, ngMessages, ngAria])
  .config(routing)
  .component('blog', {
    template: require('./blog.pug'),
    controller: BlogController
  })
  .name;
