import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './post.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';

export class PostController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, $routeParams) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    this.$routeParams = $routeParams;
  }

  $onInit() {
    console.log(this.$routeParams.postId);
    this.$http.get(`/api/posts/${this.$routeParams.postId}`)
      .then(response => {
        this.post = response.data;
        console.log(this.post)
        //this.socket.syncUpdates('posts', this.listPosts);
      });
  }
}

export default angular.module('rogatisEtiBrApp.post', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial])
  .config(routing)
  .component('post', {
    template: require('./post.pug'),
    controller: PostController
  })
  .name;
