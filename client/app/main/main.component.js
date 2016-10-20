import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';
//import ngResponsiveImage from 'ng-responsive-image';
import angularGrid from 'angulargrid';
//const ngFitText = require('ng-fittext');



export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    this.listImportantProjects = [{title:'bla', url: "/assets/images/skydive3.jpg"}, {title:"bla1",  url: "/assets/images/skydive3.jpg"}, {title:"bla2",  url: "/assets/images/skydive3.jpg"}];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('rogatisEtiBrApp.main', [ngRoute, angularGrid])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
