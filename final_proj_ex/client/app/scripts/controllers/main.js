'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function($scope, Activity, User) {

	$scope.loggedInUser = undefined;

	$scope.activities = Activity.getList({limit:100}).$object;
	$scope.bookmarks = [];

	Activity.getList({limit:100}).then(function(allActivities) {
		for (var i = 0; i < allActivities.length; ++i) {
			$scope.bookmarks.push(false);
		}
	});

	$scope.newActivity = function() {
		var newA = {
			title: $scope.newActivityTitle,
			cost: $scope.newActivityCost,
			location: $scope.newActivityLocation,
			vote: 0,
			bookmarkUsers: []
		};

        Activity.post(newA).then(function() {
          //$location.path('/activities');
          $scope.activities = Activity.getList({limit:100}).$object;

          $scope.bookmarks = [];
          Activity.getList({limit:100}).then(function(allActivities) {
			  if ($scope.loggedInUser) {
	          	for (var i = 0; i < allActivities.length; ++i) {
					if (allActivities[i].bookmarkUsers.includes($scope.loggedInUser)) {
						$scope.bookmarks.push(true);
					} else {
						$scope.bookmarks.push(false);
					}
				  }
	          } else {
	          	for (var i = 0; i < allActivities.length; ++i) {
					$scope.bookmarks.push(false);
				}
	          }
		  });
        });

		$('#new-activity-title').val(undefined);
		$('#new-activity-cost').val(undefined);
		$('#new-activity-location').val(undefined);
		//$('#new-activity').modal('hide');
	};

	$scope.upVote = function(index) {
		Activity.getList({title:$scope.activities[index].title}).then(function(activityRes) {
			var thisActivity = activityRes[0];
			thisActivity.vote++;
			thisActivity.put();
			$scope.activities[index] = thisActivity;
		});
	};

	$scope.downVote = function(index) {
		Activity.getList({title:$scope.activities[index].title}).then(function(activityRes) {
			var thisActivity = activityRes[0];
			thisActivity.vote--;
			thisActivity.put();
			$scope.activities[index] = thisActivity;
		});
	};

	$scope.addBookmark = function(index) {
		//$scope.activities[index].bookmarkUsers.push('testUser');
		Activity.getList({title:$scope.activities[index].title}).then(function(activityRes) {
			var thisActivity = activityRes[0];
			if (!thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
				thisActivity.bookmarkUsers.push($scope.loggedInUser);
				thisActivity.put();
				$scope.bookmarks[index] = true;
			}
			$scope.activities[index] = thisActivity;
		});
	};

	$scope.removeBookmark = function(index) {
		//$scope.activities[index].bookmarkUsers.push('testUser');
		Activity.getList({title:$scope.activities[index].title}).then(function(activityRes) {
			var thisActivity = activityRes[0];
			if (thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
				thisActivity.bookmarkUsers.splice(thisActivity.bookmarkUsers.indexOf($scope.loggedInUser), 1);
				thisActivity.put();
				$scope.bookmarks[index] = false;
			}
			$scope.activities[index] = thisActivity;
		});
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

	$scope.newUser = function() {
		var newU = {
			username: $scope.registerUsername,
			password: $scope.registerPassword,
			likes: []
		};

		var alreadyExists = false;
		User.getList({limit:100}).then(function(allUsers) {
			for (var i = 0; i < allUsers.length; ++i) {
				if (allUsers[i].username === newU.username) {
					alreadyExists = true;
					break;
				}
			}
		});

		if (!alreadyExists) {
			User.post(newU).then(function() {
	          $scope.loggedInUser = newU.username;
	          $scope.activities = Activity.getList({limit:100}).$object;

	          $scope.bookmarks = [];
			  Activity.getList({limit:100}).then(function(allActivities) {
	          	for (var i = 0; i < allActivities.length; ++i) {
					if (allActivities[i].bookmarkUsers.includes($scope.loggedInUser)) {
						$scope.bookmarks.push(true);
					} else {
						$scope.bookmarks.push(false);
					}
				  }
			  });
	        });
		} else {
			alert("Sorry, the username \'" + $scope.registerUsername + "\' is already taken. Please choose another.");
		}

		$('#register-username').val(undefined);
		$('#register-password').val(undefined);
		//$('#new-activity').modal('hide');
	};

	$scope.loginUser = function() {
		var alreadyExists = false;
		var correctpw = "";
		User.getList({limit:100}).then(function(allUsers) {
			for (var i = 0; i < allUsers.length; ++i) {
				if (allUsers[i].username === $scope.loginUsername) {
					alreadyExists = true;
					correctpw = allUsers[i].password;
					break;
				}
			}
		});


		setTimeout(function() {
			if (alreadyExists && $scope.loginPassword === correctpw) {
	          $scope.loggedInUser = $scope.loginUsername;
	          $scope.activities = Activity.getList({limit:100}).$object;

	          $scope.bookmarks = [];
	          Activity.getList({limit:100}).then(function(allActivities) {
	          	for (var i = 0; i < allActivities.length; ++i) {
					if (allActivities[i].bookmarkUsers.includes($scope.loggedInUser)) {
						$scope.bookmarks.push(true);
					} else {
						$scope.bookmarks.push(false);
					}
				  }
			  });
			} else {
				alert("Sorry, the login information provided is incorrect. Please try again or register a new user.");
			}

			$('#login-username').val(undefined);
			$('#login-password').val(undefined);
			//$('#new-activity').modal('hide');
		}, 300);
	};

	$scope.logoutUser = function() {
		$scope.loggedInUser = undefined;

		$scope.activities = Activity.getList({limit:100}).$object;
		$scope.bookmarks = [];

		Activity.getList({limit:100}).then(function(allActivities) {
			for (var i = 0; i < allActivities.length; ++i) {
				$scope.bookmarks.push(false);
			}
		});
	};

});
