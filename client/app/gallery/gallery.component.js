import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './gallery.routes';
import ngMdIcons from 'angular-material-icons';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import angularGrid from 'angulargrid';
import ngFileUpload from 'ng-file-upload';
import ngImageDimensions from 'angular-image-dimensions';


export class GalleryController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, Upload, angularGridInstance, $log) {
    this.$http = $http;
    this.$scope = $scope;
    this.$log = $log;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    this.Upload = Upload;
    this.file;
    this.determinateValue;
    this.activated = false;
    this.angularGridInstance = angularGridInstance;
  }

  deleteImage(imageName) {
    this.$http.delete(`/api/imageGallery/${imageName}`)
      .then(this.loadImages());
    this.angularGridInstance.gallery.refresh();
  }

  $onInit() {
    this.loadImages();
  }

  loadImages() {
    this.$http.get('/api/imageGallery')
    .then(response => {
      this.listImages = response.data;
    });
  }
  onFileSelect(files) {
    const filename = files.name;
    const type = files.type;
    const query = {
      filename,
      type
    };
    this.$http.post('api/imageGallery/signing', query)
      .then(res => {
        let result = res.data;
        this.Upload.upload({
          url: result.url, //s3Url
          transformRequest: (data, headersGetter) => {
            const headers = headersGetter();
            delete headers.Authorization;
            return data;
          },
          fields: result.fields, //credentials
          method: 'POST',
          file: files
        })
        .progress(evt => {
          this.determinateValue = parseInt(100.0 * evt.loaded / evt.total, 10);
        })
        .then(() => {
          // file is uploaded successfully
          this.determinateValue = 0;
          this.loadImages();
        })
        .catch (err => this.$log.error('erroooo', err));
      })
      .catch ((data, status) => {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        this.$log.error('pau pau', data, status);
      });
  }
}


export default angular.module('rogatisEtiBrApp.gallery', [ngRoute, ngMdIcons, ngMessages, ngAria, angularGrid, ngFileUpload, ngMaterial, 'ngImageDimensions'])
  .config(routing)
  .component('gallery', {
    template: require('./gallery.pug'),
    controller: GalleryController
  })
  .name;
