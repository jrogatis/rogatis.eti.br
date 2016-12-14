import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './about.routes';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngMaterial from 'angular-material';
import nvd3 from 'angular-nvd3';
import d3 from 'd3';

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
        extended: true,
        growOnHover: true,
        type: 'discreteBarChart',
        height: 550,
        width: angular.element(document.getElementById('aboutContainer'))[0].clientWidth,
        showYAxis: true,
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
          //rotateLabels: -90,
         
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
        css: {}
      }
    };

    this.data = [{
      key: 'Cumulative Return',
      values: [
        { label: 'JavaScript', value: 2 },
        { label: 'Angular', value: 4.5 },
        { label: 'React', value: 4 },
        { label: 'React Native', value: 3 },
        { label: 'MongoDB', value: 3 },
        { label: 'Barista', value: 1.6 },
        { label: 'Sky Diver', value: 4 }
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
    const innerSize = angular.element(document.getElementById('aboutContainer'))[0].clientWidth;
    //console.log(innerSize);
    if(innerSize < 599) {
      return 45;
    } else {
      return 63;
    }
  }

  resized(ev) {
    const innerSize = angular.element(document.getElementById('aboutContainer'))[0].clientWidth;
    //console.log(innerSize);
    this.graphOptions.chart.width = innerSize;
    this.graphOptions.chart.margin.left = this.leftMargin();
    //this.repositionXLabel();
    this.api.update();
    return this.$scope.$broadcast('resize');
  }

  graphEvents(ev) {
    console.log(ev);
  }

  repositionXLabel() {
    const xTicks = d3.select('.nv-x').selectAll('g');
    
    xTicks
      .selectAll('text')
      .attr('transform', (d,i,j) => 'translate (0, -100)');
  }
}

export default angular.module('rogatisEtiBrApp.about', [ngRoute, ngMdIcons, ngMessages, ngAria, ngMaterial, 'ngMeta', nvd3])
  .config(routing)
  .component('about', {
    template: require('./about.pug'),
    controller: AboutController
  })
  .name;
