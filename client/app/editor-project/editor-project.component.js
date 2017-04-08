import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './editor-project.routes';
import jsonpatch from 'fast-json-patch';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

export class EditorProjectController {

  /*@ngInject*/
  constructor($http, $scope, $mdDialog, Slug) {
    this.$http = $http;
    this.$mdDialog = $mdDialog;
    this.$scope = $scope;
    this.$scope.customFullscreen = false;
    this.addOrSave = 'Add';
    this.Slug = Slug;
    this.projectTypes = [
      'Demo', 'Demo MEAN Stack', 'Demo MERN Stack',
      'Demo React', 'Demo Angular', 'WordPress',
      'React', 'MEAN Stack'
    ];
  }

  $onInit() {
    this.$http.get('/api/projects')
      .then(response => {
        this.listProjects = response.data;
      });
  }

  loadForEdition(index) {
    this.addOrSave = 'Save';
    this.project = this.listProjects[index];
    this.observer = jsonpatch.observe(this.project);
    if(this.project.slug === '' || this.project.slug === undefined) {
      this.project.slug = this.Slug.slugify(this.project.title);
    }
    if(this.project.hasDesc === '' || this.project.hasDesc === undefined) {
      this.project.hasDesc = false;
    }
  }

  handleSubmit(ev) {
    if(this.addOrSave !== 'Save') {
      this.handleAdd();
    } else {
      this.handleSave(ev);
    }
  }

  handleSave(ev) {
    console.log(this.project.hasDesc);
    this.project.hasDesc = (this.project.hasDesc !== undefined);
    const patches = jsonpatch.generate(this.observer);
    console.log(patches);
    this.$http.patch(`/api/projects/${this.project._id}`, patches)
      .then(res => {
        if(res.status === 200) {
          this.showDialogSaveOk(ev);
        }
      })
      .catch(error => console.log('ops a error!', error));
  }

  handleAdd(ev) {
    this.$http.post('/api/projects', this.project)
      .then(res => {
        console.log(res);
        if(res.status === 201) {
          this.showDialogSaveOk(ev);
        }
      })
      .catch(error => console.log('ops a error!', error));
  }

  showDialogSaveOk(ev) {
    this.dialog = this.$mdDialog.show({
      scope: this.$scope,
      preserveScope: true,
      controller: DialogImagesGalleryController,
      templateUrl: 'saveOk.tmpl.pug',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: this.$scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
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
    this.dialog = this.$mdDialog.show({
      scope: this.$scope,
      preserveScope: true,
      controller: DialogImagesGalleryController,
      templateUrl: 'preview.tmpl.pug',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: this.$scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
  }
}

DialogImagesGalleryController.$inject = ['$scope', '$mdDialog'];

function DialogImagesGalleryController($scope, $mdDialog) {
  $scope.hide = () => {
    $mdDialog.hide();
  };
  $scope.cancel = () => {
    $mdDialog.cancel();
  };
  $scope.answer = answer => {
    $mdDialog.hide(answer);
  };
}

export default angular.module('rogatisEtiBrApp.editorProject', [ngRoute, ngMaterial, ngMessages, 'slugifier'])
  .config(routing)
  .component('editorProject', {
    template: require('./editor-project.pug'),
    controller: EditorProjectController
  })
  .name;
