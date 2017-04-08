import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './post.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';
import ngMeta from 'ng-meta';

export class ProjectDetails {

  /*@ngInject*/
  constructor(
    $http, $scope, $animate,
    $mdDialog, socket, $routeParams, $location, ngMeta) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    this.$routeParams = $routeParams;
    this.ngMeta = ngMeta;
    this.$location = $location;
  }

  $onInit() {
    this.$http.get(`/api/ProjectDetails/${this.$routeParams.projectId}`)
      .then(response => {
        this.post = response.data;
        this.ngMeta.setTitle(this.projectDetails.title);
        this.ngMeta.setTag('og:type', 'article');
        this.ngMeta.setTag('og:title', this.projectDetails.title);
        this.ngMeta.setTag('description', this.projectDetails.snipet);
        this.ngMeta.setTag('og:description', this.projectDetails.snipet);
        this.ngMeta.setTag('og:url', this.$location.absUrl());
        this.ngMeta.setTag('og:image', this.projectDetails.postImage);
      });
  }
}

export default angular.module('rogatisEtiBrApp.projectDetails', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial, 'ngMeta'])
  .config(routing)
  .component('post', {
    template: require('./projectDetails.pug'),
    controller: ProjectDetails
  })
  .name;

