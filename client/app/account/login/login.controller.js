'use strict';

export default class LoginController {
  /*@ngInject*/
  constructor(Auth, $location) {
    this.Auth = Auth;
    this.$location = $location;
  }

  login(loginForm) {
    this.submitted = true;
    if(loginForm.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(res => {
          console.log(res);
          // Logged in, redirect to home
          this.$location.path('/');
        })
        .catch(err => {
          console.log(err);
          this.errors.login = err.message;
        });
    }
  }
}
