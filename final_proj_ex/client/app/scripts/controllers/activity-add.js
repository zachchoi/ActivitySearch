'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ActivityAddCtrl
 * @description
 * # ActivityAddCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ActivityAddCtrl', function ($scope, Activity, $location) {
    $scope.activity = {};
    $scope.saveActivity = function() {
      Activity.post($scope.activity).then(function() {
        //$location.path('/activities');
        console.log('nice');
      });
    };
  });
