import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './editor.routes';
import textAngular from 'textangular';
import jsonpatch from 'fast-json-patch';
//import _ from 'lodash';
import ui from 'angular-ui-tinymce';
import slugifier from 'wb-angular-slugify';



var sanit = require('textangular/dist/textAngular-sanitize.min');

export class EditorController {

  /*@ngInject*/
  constructor($http, $scope, socket, $mdDialog, $location, Slug) {
    this.$http = $http;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    this.$scope = $scope;
    this.$scope.customFullscreen = false;
    this.$location = $location;
    this.pageInfo;
    this.Slug = Slug;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('posts');
    });
  }

  $onInit() {
    this.loadPosts();
    this.$scope.tinymceOptions = {
      onChange: function(e) {
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
      toolbar: 'insertfile undo redo | styleselect | bold italic | fontselect | fontsizeselect |alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | code',
      theme: 'modern',
      style_formats: [
        {
          title: 'Image Left',
          selector: 'img',
          styles: {
            'float': 'left',
            'margin': '0 10px 0 10px'
          }
      },
        {
          title: 'Image Right',
          selector: 'img',
          styles: {
            'float': 'right',
            'margin': '0 0 10px 10px'
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

  loadPosts() {
    this.$http.get('/api/posts')
      .then(response => {
        this.listPosts = response.data;
        this.socket.syncUpdates('posts', this.listPosts);
      });
  }

  loadForEdition(index) {
    this.post = this.listPosts[index];
    this.observerPost = jsonpatch.observe(this.post);
    if (this.post.slug === '' || this.post.slug === undefined) {
      this.post.slug = this.Slug.slugify(this.post.title);
    }
    this.$http.get(`/api/pageInfos/pageUrl/${encodeURIComponent('/post/' + this.post.slug )}`)
      .then(res => {
        this.pageInfo = res.data;
        this.observerPageInfo = jsonpatch.observe(this.pageInfo);
      })
      .catch(err => {
        console.log('error on loadForEdition', err)
        if (err.status === 500 || err.status === 404) {
          this.handlePageInfoAdd();
        }
      });
  }

  handlePostUpdate(ev) {
    const patches = jsonpatch.generate(this.observerPost);
    this.$http.patch(`/api/posts/${this.post._id}`, patches)
      .then(() => {
        this.handlePageInfoUpdate(ev);
        this.loadPosts();
      })
      .catch(err => console.log(err));
  }

  handlePageInfoUpdate(ev) {
    this.pageInfo.pageName = this.post.title;
    this.pageInfo.pageDesc = this.post.snipet;
    this.pageInfo.pageImgUrl = this.post.postImage;
    this.pageInfo.pageUrl = `/post/${this.post.slug}`;
    let patches = jsonpatch.generate(this.observerPageInfo);
    this.$http.patch(`/api/pageInfos/${this.pageInfo._id}`, patches)
      .then(this.showDialogSave(ev));
  }

  handlePageInfoAdd() {
    this.pageInfo = {
      pageName: this.post.title,
      pageDesc: this.post.snipet,
      pageImgUrl: this.post.postImage,
      pageUrl: `/post/${this.post.slug}`
    };
    this.$http.post('/api/pageInfos', this.pageInfo)
      .then(
        this.$http.get(`/api/pageInfos/pageUrl/${encodeURIComponent('/post/' + this.post.slug )}`)
        .then(res => {
          this.pageInfo = res.data;
          this.observerPageInfo = jsonpatch.observe(this.pageInfo);
        })
        .catch(err => console.log('error on handlePageInfoAdd no get do pageurl', err))
      )
      .catch(err => console.log('error on handlePageInfoAdd', err));
  }

  newPost() {
    this.post = undefined;
    this.pageInfo = undefined;
    this.observerPageInfo = undefined;
    this.observerPost = undefined;
    this.loadPosts();
  }

  handlePostAdd(ev) {
    //console.log("add");
    if(this.post.slug === '' || this.post.slug === undefined) {
      this.post.slug = this.Slug.slugify(this.post.title);
    }
    this.$http.post('/api/posts', this.post)
      .then(() => {
        this.handlePageInfoAdd();
        this.showDialogSave(ev);
      })
  }

  handlePostDelete(index) {
    this.$http.delete(`api/posts/${this.listPosts[index]._id}`)
      .then(() => {
        this.$http.delete(`/api/pageInfos/${this.pageInfo._id}`)
          .then(() => {
            this.loadPosts();
            this.post = undefined;
            this.pageInfo = undefined;
          })
          .catch(err => console.log('err at delete posts page info', err));

      })
      .catch(err => console.log('err at delete posts', err));
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
            this.post.postImage = `https://s3.amazonaws.com/rogatis/${this.imagesList[answer]}`;
          });
      });
  }

  showDialogSave(ev) {
    this.dialog = this.$mdDialog.show({
      scope: this.$scope,
      preserveScope: true,
      controller: DialogImagesGalleryController,
      templateUrl: 'save.tmpl.pug',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: this.$scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
  };

}

DialogImagesGalleryController.$inject = ['$scope', '$mdDialog'];

function DialogImagesGalleryController($scope, $mdDialog) {
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
}

export default angular.module('rogatisEtiBrApp.editor', [ngRoute, textAngular, 'ui.tinymce', 'slugifier'])
  .config(routing)
  .component('editor', {
    template: require('./editor.pug'),
    controller: EditorController
  })
  .name;
