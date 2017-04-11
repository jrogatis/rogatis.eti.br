import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './blog.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';

export class BlogController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, ngMeta, $location, $sce) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.ngMeta = ngMeta;
    this.$mdDialog = $mdDialog;
    this.$location = $location;
    this.$sce = $sce;
  }
  $onInit() {
    this.$http.get('/api/posts')
      .then(response => {
        this.listPosts = response.data;
        this.listPosts = this.listPosts.filter(post => post.active === true);
        this.ngMeta.setTitle('Jean Philip de Rogatis Tech Blog');
        this.ngMeta.setTag('og:title', 'Jean Philip de Rogatis Tech Blog');
        this.ngMeta.setTag('description', 'Blog about been a code warrior! From Jean Philip de Rogatis');
        this.ngMeta.setTag('og:description', 'Blog about been a code warrior! From Jean Philip de Rogatis');
        this.ngMeta.setTag('og:url', this.$location.absUrl());
        this.ngMeta.setTag('og:image', 'https://s3.amazonaws.com/rogatis/anxiusbw.jpg');
        this.socket.syncUpdates('posts', this.listPosts);
      });
  }

  deliberatelyTrustDangerousSnippet(postHtml) {
    //console.log(postHtml);
    return this.$sce.trustAsHtml(postHtml);
  }

}

export default angular.module('rogatisEtiBrApp.blog', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial, 'ngMeta'])
  .config(routing)
  .component('blog', {
    template: require('./blog.pug'),
    controller: BlogController
  })
  .name;
