import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './editor.routes';
import textAngular from 'textangular';
import jsonpatch from 'fast-json-patch';
import _ from 'lodash';
var sanit = require('textangular/dist/textAngular-sanitize.min');

export class EditorController {

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

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
  }

  handleSave() {
    const observer = jsonpatch.observe(this.postAnt);
    this.postAnt.text = this.post.text;
    this.postAnt.title = this.post.title;
    this.postAnt.snipet = this.post.snipet;
    let patches = jsonpatch.generate(observer);
    this.$http.patch(`/api/posts/${this.postAnt._id}`, patches);
  }
}

export default angular.module('rogatisEtiBrApp.editor', [ngRoute, textAngular])
  .config(routing)
  .component('editor', {
    template: require('./editor.pug'),
    controller: EditorController
  })
  .name;

