var app = angular.module('ActivitySearch', []);

app.controller('searchResult',[ '$scope', '$http', function($scope, $http) {
	var searchResult = $scope
	searchResult.results = new Array(20).fill("Hello my name is Zach nice to meet you");
}]);