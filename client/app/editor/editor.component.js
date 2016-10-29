import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './editor.routes';
import textAngular from 'textangular';
import jsonpatch from 'fast-json-patch';
import _ from 'lodash';
var sanit = require('textangular/dist/textAngular-sanitize.min');

export class EditorController {

  /*@ngInject*/
  constructor($http, $scope, socket, $mdDialog, Util) {
    this.$http = $http;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    this.$scope =  $scope;
    this.$scope.customFullscreen = false;
    this.Util = Util;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('posts');
    });
  }

  $onInit() {
    this.$http.get('/api/posts')
      .then(response => {
        this.listPosts = response.data;
        this.socket.syncUpdates('posts', this.listPosts);
      });
  }

  loadForEdition(index) {
    this.post = this.listPosts[index];
    this.postAnt = _.clone(this.post);
    if(this.post.slug === '' || this.post.slug === undefined ) {
     this.post.slug = this.Util.slugify(this.post.title);
    }
  }

  handleSave() {
    const observer = jsonpatch.observe(this.postAnt);
    this.postAnt.text = this.post.text;
    this.postAnt.title = this.post.title;
    this.postAnt.snipet = this.post.snipet;
    this.postAnt.postImage = this.post.postImage;
    this.postAnt.active = this.post.active;
     this.postAnt.slug = this.post.slug;
    let patches = jsonpatch.generate(observer);
    this.$http.patch(`/api/posts/${this.postAnt._id}`, patches);
  }

   handleAdd() {
    this.$http.post('/api/posts', this.post)
  }

  showDialog(ev) {
    this.$http.get('api/imageGallery')
      .then (images => {
        console.log(images);
        this.imagesList = images.data;
        this.dialog = this.$mdDialog.show({
        scope: this.$scope,
        preserveScope: true,
        controller: DialogImagesGalleryController,
        templateUrl: 'selectImage.tmpl.pug',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        fullscreen: this.$scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(answer => {
        this.post.postImage = `https://s3.amazonaws.com/rogatis/${this.imagesList[answer]}`;
      });
    })
  }
}

DialogImagesGalleryController.$inject = ['$scope', '$mdDialog'];

function DialogImagesGalleryController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}

export default angular.module('rogatisEtiBrApp.editor', [ngRoute, textAngular])
  .config(routing)
  .component('editor', {
    template: require('./editor.pug'),
    controller: EditorController
  })
  .name;


