'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function($scope, Activity) {
	// var searchResult = $scope;
	// searchResult.results = [];
	// searchResult.loginStatus = false;

	$scope.activities = Activity.getList({limit:100}).$object;

	$scope.newActivity = function() {
		var newA = {
			title: $scope.newActivityTitle,
			cost: $scope.newActivityCost,
			location: $scope.newActivityLocation,
			vote: 0
		};

        Activity.post(newA).then(function() {
          //$location.path('/activities');
          $scope.activities = Activity.getList({limit:100}).$object;
        });

		$('#new-activity-title').val(undefined);
		$('#new-activity-cost').val(undefined);
		$('#new-activity-location').val(undefined);
		//$('#new-activity').modal('hide');
	};

	$scope.upVote = function(index) {
		// console.log($scope.activities);
		$scope.activities[index].vote++;
	};

	$scope.downVote = function(index) {
		$scope.activities[index].vote--;
	};

	$scope.filterPrice = function(priceF) {
		if (priceF === 'All') {
			$('#priceFilterBtn').text('Cost');
			$scope.activities = Activity.getList({limit:100}).$object;
		} else {
			$('#priceFilterBtn').text(priceF);
			$scope.activities = Activity.getList({cost:priceF, limit:100}).$object;
		}
	};

	$scope.filterLocation = function(locationF) {
		if (locationF === 'All') {
			$('#locationFilterBtn').text('Location');
			$scope.activities = Activity.getList({limit:100}).$object;
		} else {
			$('#locationFilterBtn').text(locationF);
			$scope.activities = Activity.getList({location:locationF, limit:100}).$object;
		}
	};

});
