import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './contact.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';

export class ContactController {

  /*@ngInject*/
  constructor($http, $scope, $mdToast, $animate, socket) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdToast = $mdToast;

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function () {
      return Object.keys($scope.toastPosition)
        .filter(function (pos) {
          return $scope.toastPosition[pos];
        })
        .join(' ');
    };

  }
  sendMail() {

    var data = ({
      contactName: `${this.fistName} ${this.lastName}`,
      contactEmail: this.email,
      contactMsg: this.message
    });


    this.$http.post('/contact-form', data).
    success(function (data, status, headers, config) {

      this.$mdToast.show(
        this.$mdToast.simple()
        .content('Thanks for your message ' + data.contactName + ' You Rock!')
        .position($scope.getToastPosition())
        .hideDelay(5000)
      );

    }).
    error(function (data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  };

  sendEmail() {
    console.log('sim', this.user);
    this.$http.post('/api/contactForm', this.user)
      .then(res=>console.log(res));
    this.$scope.emailForm.$setPristine()
    this.$scope.emailForm.$setUntouched()
    this.user = {};
  };

}
export default angular.module('rogatisEtiBrApp.contact', [ngRoute, ngMdIcons, ngMessages, ngAria])
  .config(routing)
  .component('contact', {
    template: require('./contact.pug'),
    controller: ContactController
  })
  .name;
