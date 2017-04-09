'use strict';

export default class LoginController {
  /*@ngInject*/
  constructor(Auth, $location, $log) {
    this.Auth = Auth;
    this.$location = $location;
    this.$log = $log;
  }

  login(loginForm) {
    this.submitted = true;
    if(loginForm.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(res => {
          this.$log.debug(res);
          // Logged in, redirect to home
          this.$location.path('/');
        })
        .catch(err => {
          this.$log.error(err);
          this.errors.login = err.message;
        });
    }
  }
}
