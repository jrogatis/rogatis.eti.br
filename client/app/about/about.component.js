import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './about.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';
import ezfb from 'angular-easyfb';
import nvd3 from 'angular-nvd3';
import d3 from 'd3';
//import { d3.scaleLinear }  from 'd3-scale';
//import ngMeta from 'ng-meta';


export class AboutController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, ngMeta, $location, $window) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.ngMeta = ngMeta;
    this.$mdDialog = $mdDialog;
    this.$location = $location;
    this.$window = $window;
    this.listPics = [
      { imgUrl: '../../assets/images/picsAbout9100.jpg' },
      { imgUrl: '../../assets/images/picsAbout98f8.jpg' },
      { imgUrl: '../../assets/images/picsAbout99c4.jpg' },
    ];
    this.graphOptions = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        width: $window.innerWidth - 150,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: d => d.label,
        y: d => d.value,
        showValues: true,
        valueFormat: d => d3.format(',.0f')(d),
        transitionDuration: 10,
        xAxis: {
          axisLabel: 'x Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: 30
        },
        yDomain: [0, 100]
      }
    };

    this.data = [{
      key: 'Cumulative Return',
      values: [
        { label: 'JavaScript', value: 90 },
        { label: 'Angular', value: 100 },
        { label: 'React', value: 82 },
        { label: 'React Native', value: 100 },
        { label: 'MongoDB', value: 90 },
        { label: 'Barista', value: 37 }
      ]
    }];
  }

  $onInit() {
    this.ngMeta.setTitle(' About Jean Philip de Rogatis');
    this.ngMeta.setTag('og:title', 'About Jean Philip de Rogatis');
    this.ngMeta.setTag('description', 'about Jean Philip de Rogatis tech skills');
    this.ngMeta.setTag('og:description', 'about Jean Philip de Rogatis technical skills');
    this.ngMeta.setTag('og:url', this.$location.absUrl());
    this.ngMeta.setTag('og:image', 'https://s3.amazonaws.com/rogatis/anxiusbw.jpg');
    angular.element(window).on('resize', ev => this.resized(ev));
  }

  scaleY() {
    console.log()  
    return d3.scaleLinear()
      .domain([0, 100])
      .range(['Newbie', 'Geek', 'Ninja', 'Jedi']);
  }

  resized(ev) {
    console.log('fired', this.$window.innerWidth);
    this.graphOptions.width = this.$window.innerWidth - 150;
    return this.$scope.$broadcast('resize');
  }
}

export default angular.module('rogatisEtiBrApp.about', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial, 'ezfb', 'ngMeta', nvd3])
  .config(routing)
  .component('about', {
    template: require('./about.pug'),
    controller: AboutController
  })
  .name;
