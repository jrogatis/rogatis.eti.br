import angular from 'angular';


export class FooterComponent {
  /*@ngInject*/
  constructor($http, $scope) {
    this.$scope = $scope;
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/sysInfo/ver')
      .then(result => {
        this.verNumber = result.data.ver;
      });
  }
}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.pug'),
    controller: FooterComponent
  })
  .name;
