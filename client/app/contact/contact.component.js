import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './contact.routes';




export class ContactController {

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
  }

  $onInit() {

  }

}
export default angular.module('rogatisEtiBrApp.contact', [ngRoute])
  .config(routing)
  .component('contact', {
    template: require('./contact.pug'),
    controller: ContactController
  })
  .name;
