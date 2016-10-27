import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './gallery.routes';
import ngMdIcons from 'angular-material-icons';
import ngMaterial from 'angular-material'
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import angularGrid from 'angulargrid';
import ngFileUpload from 'ng-file-upload';


export class GalleryController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, Upload) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    console.log('no init');
    this.Upload = Upload;
    this.file;
    this.determinateValue;
    this.activated = false;
  }

  $onInit() {
    this.$http.get('/api/imageGallery')
      .then(response => {
        this.listImages = response.data;
      });
  }
  onFileSelect(files) {
    console.log('files', files)
      var filename = files.name;
      var type = files.type;
      var query = {
        filename: filename,
        type: type
      }
      this.$http.post('api/imageGallery/signing', query)
        .success(result => {
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
          }).progress( evt => {
           this.determinateValue =parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success((data, status, headers, config) => {
            // file is uploaded successfully
             this.determinateValue = 0;
            console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
          }).error(err => {
                console.log('erroooo', err)
          });
        })
        .error((data, status, headers, config) =>{
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        console.log('pau pau');
        });
    }
}


export default angular.module('rogatisEtiBrApp.gallery', [ngRoute, ngMdIcons, ngMessages, ngAria, angularGrid, ngFileUpload, ngMaterial])
  .config(routing)
  .component('gallery', {
    template: require('./gallery.pug'),
    controller: GalleryController
  })
  .name;
