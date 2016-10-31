'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import angularAria from 'angular-aria';
import ngAnimate from 'angular-animate';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';
import socialShare from 'angular-socialshare';

export class SocialShareComponent {
  constructor($location, $mdSidenav, $animate, $scope, Auth, $http) {
    'ngInject';
    $scope.pageClass = 'pageNavbar';
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$scope = $scope;
    this.enterState = true;
    this.$http = $http;
    var _this = this;

    this.$scope.$on('$routeChangeSuccess', function (current, previous) {
      const encoded = encodeURIComponent($location.url());
      $http.get(`/api/pageInfos/pageUrl/${encoded}`)
        .then(res => {
          _this.pageInfo = res.data;
          if($location.host() === 'localhost') {
            _this.pageInfo.pageUrl = `http://www.rogatis.eti.br${$location.path()}`
          }
          $http.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyB_G-qM_alqi-KRwuQBLagjFXJkwVGERa4', {
              longUrl: _this.pageInfo.pageUrl
            })
            .success((data, status, headers, config) => {
              _this.pageInfo.shortUrl = data.id;
            })
            .error((data, status, headers, config) => {
              console.log('error', data);
            });
        });

    });
  }

  isActive(route) {
    return route === this.$location.path();
  }
}

export default angular.module('directives.socialShare', [angularAria, ngAnimate, angularMaterial, angularMessages, socialShare])
  .component('socialShareJp', {
    template: require('./social-share.pug'),
    controller: SocialShareComponent
  }).name;
