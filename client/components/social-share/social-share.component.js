'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import angularAria from 'angular-aria';
import ngAnimate from 'angular-animate';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';
import socialShare from 'angular-socialshare';

export class SocialShareComponent {
  constructor($location, $mdSidenav, $animate, $scope, Auth, $http, $log) {
    'ngInject';
    $scope.pageClass = 'pageNavbar';
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$scope = $scope;
    this.$log = $log;
    this.enterState = true;
    this.$http = $http;
    const that = this;

    this.$scope.$on('$routeChangeSuccess', () => {
      const encoded = encodeURIComponent($location.path());
      $http.get(`/api/pageInfos/pageUrl/${encoded}`)
        .then(res => {
          that.pageInfo = res.data;
          that.pageInfo.pageUrl = $location.absUrl();
          if ($location.host() === 'localhost') {
            that.pageInfo.pageUrl = `http://www.rogatis.eti.br${$location.path()}`;
          }
          $http.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyB_G-qM_alqi-KRwuQBLagjFXJkwVGERa4', {
            longUrl: $location.absUrl()
          })
          .success(data => {
            that.pageInfo.shortUrl = data.id;
          })
          .error(data => {
            this.$log.error('error get short url', data);
          });
        })
        .catch (err => this.$log.error('error on get page info at social share component', err));
    });
  }

}

export default angular.module('directives.socialShare', [angularAria, ngAnimate, angularMaterial, angularMessages, socialShare])
  .component('socialShareJp', {
    template: require('./social-share.pug'),
    controller: SocialShareComponent
  }).name;
