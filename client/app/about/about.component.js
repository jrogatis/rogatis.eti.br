import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './about.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';
import nvd3 from 'angular-nvd3';
import d3 from 'd3';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

export class AboutController {

  /*@ngInject*/
  constructor($http, $scope, $animate, $mdDialog, socket, ngMeta, $location, $window, $log, $document) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$log = $log;
    this.ngMeta = ngMeta;
    this.$mdDialog = $mdDialog;
    this.$location = $location;
    this.$window = $window;
    this.$document = $document;
    this.listPics = [
      { imgUrl: '../../assets/images/picsAbout9100.jpg' },
      { imgUrl: '../../assets/images/picsAbout98f8.jpg' },
      { imgUrl: '../../assets/images/picsAbout99c4.jpg' },
      { imgUrl: '../../assets/images/picsAboutActionFig.jpg' },
      { imgUrl: '../../assets/images/picsAboutBallon.jpg' },
      { imgUrl: '../../assets/images/picsAboutCoffe.jpg' },
      { imgUrl: '../../assets/images/picsAboutPlaneDor.jpg' },
      { imgUrl: '../../assets/images/picsAboutPlane.jpg' },
    ];
    this.imgToDisplay = this.listPics[0].imgUrl;
    this.graphOptions = {
      chart: {
        extended: true,
        growOnHover: true,
        type: 'discreteBarChart',
        height: 550,
        width: angular.element(this.$document.getElementById('aboutContainer'))[0].clientWidth,
        showYAxis: true,
        color: d => d.color,
        margin: {
          top: 50,
          right: 10,
          bottom: 10,
          left: this.leftMargin()
        },
        x: d => d.label,
        y: d => d.value,
        showValues: false,
        valueFormat: d => this.scaleY()(d),
        duration: 1000,
        xAxis: {
          axisLabel: '',
        },
        yAxis: {
          axisLabel: '',
          axisLabelDistance: 30,
          showMaxMin: false,
          domain: [0, 4],
          tickFormat: d => this.scaleY()(d),
          ticks: 6,
          tickSubdivide: 0,
          tickSize: 1,
        },
        yDomain: null,
        api: this.api,
        legend: {
          margin: {
            top: 5,
            right: 200,
            bottom: 5,
            left: 0
          }
        }
      },
      styles: {
        classes: {
          'with-3d-shadow': true,
          'with-transitions': true,
          gallery: false
        },
        css: {
        }
      }
    };

    this.data = [{
      key: 'Cumulative Return',
      values: [
        { label: 'JavaScript', value: 3.2, color: '#9edae5' },
        { label: 'Angular', value: 3, color: '#c7c7c7'},
        { label: 'React', value: 3.2, color: '#c5b0d5' },
        { label: 'React Native', value: 2.5, color: '#aec7e8' },
        { label: 'MongoDB', value: 3, color: '#7f7f7f' },
        { label: 'D3', value: 1.2, color: '#bcbd22' },
        { label: 'Sky Diver', value: 4, color: '#17becf' }
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
    return d3.scale.ordinal()
      .domain([0, 1, 2, 3, 4])
      .range([' ', 'Newbie', 'Geek', 'Ninja', 'Jedi', ' ']);
  }

  leftMargin() {
    const innerSize = angular.element(this.$document.getElementById('aboutContainer'))[0].clientWidth;
    //console.log(innerSize);
    if (innerSize < 599) {
      return 45;
    } else {
      return 63;
    }
  }

  resized() {
    const innerSize = angular.element(this.$document.getElementById('aboutContainer'))[0].clientWidth;
    this.graphOptions.chart.width = innerSize;
    this.graphOptions.chart.margin.left = this.leftMargin();
    this.api.update();
    return this.$scope.$broadcast('resize');
  }

  handleClick(path) {
    this.imgToDisplay = path;
  }
}

export default angular.module('rogatisEtiBrApp.about', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial, 'ngMeta', nvd3])
  .config(routing)
  .component('about', {
    template: require('./about.pug'),
    controller: AboutController
  })
  .name;
