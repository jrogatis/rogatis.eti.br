import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './about.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';
import ngMeta from 'ng-meta';


export class AboutController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, ngMeta, $location) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.ngMeta = ngMeta;
    this.$mdDialog = $mdDialog;
    this.$location = $location;
  }
  $onInit() {
    this.$http.get('/api/posts')
      .then(response => {
        this.listPosts = response.data;
        this.listPosts = this.listPosts.filter(el => {
          return el.active === true;
        });
        this.ngMeta.setTitle(' About Jean Philip de Rogatis');
        this.ngMeta.setTag('og:title', 'About Jean Philip de Rogatis');
        this.ngMeta.setTag('description', 'about Jean Philip de Rogatis techincal slills');
        this.ngMeta.setTag('og:description', 'about Jean Philip de Rogatis techincal slills');
        this.ngMeta.setTag('og:url', this.$location.absUrl());
        this.ngMeta.setTag('og:image', 'https://s3.amazonaws.com/rogatis/anxiusbw.jpg');
        this.socket.syncUpdates('posts', this.listPosts);
      });
  }
}

export default angular.module('rogatisEtiBrApp.about', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial, 'ngMeta'])
  .config(routing)
  .component('about', {
    template: require('./about.pug'),
    controller: AboutController
  })
  .name;
