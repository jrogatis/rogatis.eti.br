import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './post.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';
import ngMeta from 'ng-meta';

export class PostController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, $routeParams, $location ) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    this.$routeParams = $routeParams;
    //this.ngMeta = ngMeta;
    this.$location = $location;
  }

  $onInit() {
    /* $http.get(`/api/pageInfos/pageUrl/${encoded}`)
        .then(res => {
          this.pageInfo = res.data;
        })*/
    /*this.$http.get(`/api/posts/${this.$routeParams.postId}`)
      .then(response => {
        this.post = response.data;
          this.ngMeta.setTag('url',  this.$location.absUrl());
          this.ngMeta.setTag('image', this.post.postImage);
          this.ngMeta.setTag('description', this.post.snipet);
          this.ngMeta.setTag('author', 'Jean Philip de Rogatis');
        //this.socket.syncUpdates('posts', this.listPosts);
      });*/
  }
}

export default angular.module('rogatisEtiBrApp.post', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial])
  .config(routing)
  .component('post', {
    template: require('./post.pug'),
    controller: PostController
  })
  .name;

