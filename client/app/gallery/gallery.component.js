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
  constructor($http, $scope, $animate, $mdDialog, socket, Upload, angularGridInstance) {
    this.$http = $http;
    this.$scope = $scope;
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
    var filename = files.name;
    var type = files.type;
    var query = {
      filename: filename,
      type: type
    };
    this.$http.post('api/imageGallery/signing', query)
      .then(res => {
        console.log(res);
        let result = res.data;
        this.Upload.upload({
          url: result.url, //s3Url
          transformRequest: (data, headersGetter) => {
            var headers = headersGetter();
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
        .catch(err => console.log('erroooo', err));
      })
      .catch((data, status) => {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log('pau pau', data, status);
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
