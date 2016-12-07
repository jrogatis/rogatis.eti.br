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

    this.$scope.$on('$routeChangeSuccess', (current, previous) => {
      //console.log($location.path());
      const encoded = encodeURIComponent($location.path());
      $http.get(`/api/pageInfos/pageUrl/${encoded}`)
        .then(res => {
          _this.pageInfo = res.data;
          //console.log('res no social',  _this.pageInfo);
          _this.pageInfo.pageUrl = $location.absUrl();
          if($location.host() === 'localhost') {
            _this.pageInfo.pageUrl = `http://www.rogatis.eti.br${$location.path()}`
          }
          //console.log(_this.pageInfo);
          $http.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyB_G-qM_alqi-KRwuQBLagjFXJkwVGERa4', {
            longUrl: $location.absUrl()
          })
          .success((data, status, headers, config) => {
            _this.pageInfo.shortUrl = data.id;
          })
          .error((data, status, headers, config) => {
            console.log('error get short url', data);
          });
        })
        .catch(err => console.log('error on get page info at social share component', err));

    });
  }

}

export default angular.module('directives.socialShare', [angularAria, ngAnimate, angularMaterial, angularMessages, socialShare])
  .component('socialShareJp', {
    template: require('./social-share.pug'),
    controller: SocialShareComponent
  }).name;
