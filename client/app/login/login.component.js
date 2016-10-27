import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './login.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';


export class LoginController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, Auth, $location) {
    this.$http = $http;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {

  }
  register(form) {
    this.submitted = true;

    if(form.$valid) {
      return this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Account created, redirect to home
          this.$location.path('/');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }

  login() {


  }
}
export default angular.module('rogatisEtiBrApp.login', [ngRoute, ngMdIcons, ngMessages, ngAria])
  .config(routing)
  .component('login', {
    template: require('./login.pug'),
    controller: LoginController
  })
  .name;
