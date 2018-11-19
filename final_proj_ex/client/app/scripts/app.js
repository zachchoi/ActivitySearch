'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngResource',
    'ngRoute',
    'restangular'
  ])
  .config(function ($routeProvider,
  RestangularProvider) {
    RestangularProvider.setBaseUrl('http://localhost:3000');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
      })
      .when('/activities', {
        templateUrl: 'views/activities.html',
        controller: 'ActivitiesCtrl',
      })
      .when('/create/activity', {
        templateUrl: 'views/activity-add.html',
        controller: 'ActivityAddCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
    })
    .factory('ActivityRestangular', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setRestangularFields({
          id: '_id'
        });
      });
    })
    .factory('Activity', function(ActivityRestangular) {
      return ActivityRestangular.service('activity');
    });