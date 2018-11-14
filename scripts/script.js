var app = angular.module('ActivitySearch', []);

app.controller('searchResult',[ '$scope', '$http', function($scope, $http) {
	var searchResult = $scope;
	searchResult.results = [];
	searchResult.loginStatus = false;

	searchResult.newActivity = function() {
		searchResult.results.push({
			title: searchResult.newActivityTitle,
			cost: searchResult.newActivityCost,
			location: searchResult.newActivityLocation,
			vote: 0
		});
		$('#new-activity-title').val(undefined);
		$('#new-activity-cost').val(undefined);
		$('#new-activity-location').val(undefined);
		$('.modal').modal('hide');
	};

	searchResult.upVote = function(index) {
		searchResult.results[index].vote++;
	};

	searchResult.downVote = function(index) {
		searchResult.results[index].vote--;
	};

}]);