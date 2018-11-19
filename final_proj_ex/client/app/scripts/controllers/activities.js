'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ActivitiesCtrl
 * @description
 * # ActivitiesCtrl
 * Controller of the clientApp
 */

angular.module('clientApp')
.controller('ActivitiesCtrl', function ($scope, Activity) {
 //  $scope.activities = [
 //    {
	// 	activityName : "yoyo",
	// 	cost : "free",
	// 	location : "central"
	// },
	// {
	// 	activityName : "hackathon",
	// 	cost : "cheap",
	// 	location : "north"
	// },
	// {
	// 	activityName : "euchre tournament",
	// 	cost : "free",
	// 	location : "central"
	// }
 //  ];

  $scope.activities = Activity.getList().$object;

});
