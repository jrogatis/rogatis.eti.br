import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './editor-project.routes';
import jsonpatch from 'fast-json-patch';
import _ from 'lodash';
import ngMaterial from 'angular-material';
import ngAnimate from 'angular-animate';
import angularGrid from 'angulargrid';

export class EditorProjectController {

  /*@ngInject*/
  constructor($http, $scope, $mdDialog) {
    this.$http = $http;
    this.$mdDialog = $mdDialog;
    this.$scope = $scope;
    this.$scope.customFullscreen = false;
    this.projectTypes = ['Demo', 'Demo MEAN Stack', 'Demo MERN Stack', 'Demo React', 'Demo Angular'];
  }

  $onInit() {
    this.$http.get('/api/projects')
      .then(response => {
        this.listProjects = response.data;
      });
  }

  loadForEdition(index) {
    this.project = this.listProjects[index];
    this.projectAnt = _.clone(this.project);
  }

  handleSave() {
    const observer = jsonpatch.observe(this.projectAnt);
    this.projectAnt.type = this.project.type;
    let patches = jsonpatch.generate(observer);
    this.$http.patch(`/api/projects/${this.projectAnt._id}`, patches);
  }

  handleAdd() {
    this.$http.post('/api/projects', this.project);
  }

  showDialog(ev) {
    this.$http.get('api/imageGallery')
      .then(images => {
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
        this.project.imgUrl = `https://s3.amazonaws.com/rogatis/${this.imagesList[answer]}`;
      });
      });
  }
  showPreview(ev) {
    console.log(this.project);
    this.dialog = this.$mdDialog.show({
      scope: this.$scope,
      preserveScope: true,
      controller: DialogImagesGalleryController,
      templateUrl: 'preview.tmpl.pug',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: this.$scope.customFullscreen // Only for -xs, -sm breakpoints.
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

export default angular.module('rogatisEtiBrApp.editorProject', [ngRoute, ngMaterial])
  .config(routing)
  .component('editorProject', {
    template: require('./editor-project.pug'),
    controller: EditorProjectController
  })
  .name;
