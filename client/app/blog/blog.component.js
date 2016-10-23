import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './blog.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';

export class BlogController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$mdDialog = $mdDialog;
    this.listPosts = [{
        title: ' Type Script or not ?'
      ,
      text: `t vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidemrerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
          quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
          Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae
          sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
          voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`
    }];

  }

  $onInit() {
    /*this.$http.get('/api/posts')
      .then(response => {
        this.listPosts = response.data;
        this.socket.syncUpdates('posts', this.listPosts);
      });*/
  }
}

export default angular.module('rogatisEtiBrApp.blog', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial])
  .config(routing)
  .component('blog', {
    template: require('./blog.pug'),
    controller: BlogController
  })
  .name;
