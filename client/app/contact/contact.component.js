import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './contact.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';

export class ContactController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
  }

  sendEmail() {
    this.$http.post('/api/contactForm', this.user)
      .then(() => {
        this.showDialog();
        this.$scope.emailForm.$setPristine();
        this.$scope.emailForm.$setUntouched();
        this.user = {};
      });
  }

  showDialog() {
    this.dialog = this.$mdDialog.show({
      scope: this.$scope,
      preserveScope: true,
      controller: DialogController,
      templateUrl: 'dialogEmailSend.tmpl.pug',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      fullscreen: this.$scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
  }
}

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}

DialogController.$inject = ['$scope', '$mdDialog'];

export default angular.module('rogatisEtiBrApp.contact', [ngRoute, ngMdIcons, ngMessages, ngAria])
  .config(routing)
  .component('contact', {
    template: require('./contact.pug'),
    controller: ContactController
  })
  .name;
