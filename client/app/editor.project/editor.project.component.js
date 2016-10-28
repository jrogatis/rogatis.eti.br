import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './editor.project.routes';
import jsonpatch from 'fast-json-patch';
import _ from 'lodash';


export class EditorProjectController {

  /*@ngInject*/
  constructor($http, $scope) {
    this.$http = $http;
    //this.socket = socket;
     console.log('saco');
    /*$scope.$on('$destroy', function() {
      socket.unsyncUpdates('projects');
    });*/
  }

  $onInit() {
    console.log('saco');
    /*this.$http.get('/api/projects')
      .then(response => {
        console.log(response);
        this.listProjects = response.data;
        //this.socket.syncUpdates('projects', this.listProjects);
      });*/
  }

  loadForEdition(index) {
    this.project = this.listProjects[index];
    this.listProjectsAnt = _.clone(this.listProjects);
  }

  handleSave() {
    const observer = jsonpatch.observe(this.listProjectsAnt);
    this.listProjectsAnt.title = this.project.title;
    this.listProjectsAnt.desc = this.project.desc;
    this.listProjectsAnt.imgUrl = this.project.imgUrl;
    this.listProjectsAnt.siteUrl = this.project.siteUrl;
    this.listProjectsAnt.displayFront = this.listProjects.displayFront;
    let patches = jsonpatch.generate(observer);
    this.$http.patch(`/api/projects/${this.listProjectsAnt._id}`, patches);
  }
}

export default angular.module('rogatisEtiBrApp.editorProject', [ngRoute])
  .config(routing)
  .component('editorProject', {
    template: require('./editor.project.pug'),
    controller: EditorProjectController
  })
  .name;
