import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './editor-project-details.routes';
import jsonpatch from 'fast-json-patch';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
import textAngular from 'textangular';

export class EditorProjectDetailsController {

  /*@ngInject*/
  constructor($http, $scope, $mdDialog, Slug, $log, $document) {
    this.$http = $http;
    this.$mdDialog = $mdDialog;
    this.$scope = $scope;
    this.$log = $log;
    this.$document = $document;
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
    this.$scope.tinymceOptions = {
      onChange: e => {
        // put logic here for keypress and cut/paste changes
      },
      selector: 'textarea',
      inline: false,
      height: 700,
      plugins: `advlist autolink link image imagetools advlist charmap print preview hr anchor pagebreak spellchecker
      searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking
      save table contextmenu directionality emoticons template paste textcolor code colorpicker`,
      skin: 'lightgray',
      font_formats: 'Prometo=prometo, Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n',
      fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
      toolbar: `insertfile undo redo | styleselect | bold italic | fontselect 
        | fontsizeselect |alignleft aligncenter alignright alignjustify 
        | bullist numlist outdent indent | link image | print preview media fullpage 
        | forecolor backcolor emoticons | code`,
      theme: 'modern',
      style_formats: [
        {
          title: 'Image Left',
          selector: 'img',
          styles: {
            float: 'left',
            margin: '0 10px 0 10px'
          }
        },
        {
          title: 'Image Right',
          selector: 'img',
          styles: {
            float: 'right',
            margin: '0 0 10px 10px'
          }
        },
        {
          title: 'Tab on Paragraf',
          selector: 'p',
          styles: {
            'text-indent': '1.5em'
          }
        }
      ]
    };
  }

  loadForEdition(index) {
    this.addOrSave = 'Save';
    this.project = this.listProjects[index];
    this.project.doneDate = new Date(this.project.doneDate);
    this.observer = jsonpatch.observe(this.project);
    if(this.project.slug === '' || angular.isUndefined(this.project.slug)) {
      this.project.slug = this.Slug.slugify(this.project.title);
    }
    if(this.project.hasDesc === '' || angular.isUndefined(this.project.hasDesc)) {
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
    this.$log.debug(this.project.hasDesc);
    this.project.hasDesc = angular.isDefined(this.project.hasDesc);
    const patches = jsonpatch.generate(this.observer);
    this.$http.patch(`/api/projects/${this.project._id}`, patches)
      .then(res => {
        if(res.status === 200) {
          this.showDialogSaveOk(ev);
        }
      })
      .catch(error => this.$log.error('ops a error!', error));
  }

  handleAdd(ev) {
    this.$http.post('/api/projects', this.project)
      .then(res => {
        this.$log.debug(res);
        if(res.status === 201) {
          this.showDialogSaveOk(ev);
        }
      })
      .catch(error => this.$log.error('ops a error!', error));
  }

  showDialogSaveOk(ev) {
    this.dialog = this.$mdDialog.show({
      scope: this.$scope,
      preserveScope: true,
      controller: DialogImagesGalleryController,
      templateUrl: 'saveOk.tmpl.pug',
      parent: angular.element(this.$document.body),
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
          parent: angular.element(this.$document.body),
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
      parent: angular.element(this.$document.body),
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

export default angular.module('rogatisEtiBrApp.editorProjectDetails', [ngRoute, ngMaterial, ngMessages, 'slugifier'])
  .config(routing)
  .component('editorProjectDetails', {
    template: require('./editor-project-details.pug'),
    controller: EditorProjectDetailsController
  })
  .name;
