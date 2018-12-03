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

  	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})

	$scope.loggedInUser = undefined;

	$scope.locationF = "All";
	$scope.priceF = "All";

	$scope.bookmarks = [];

	Activity.getList({limit:100}).then(function(allActivities) {
		allActivities.sort(function(a,b){return b.vote - a.vote});
		$scope.activities = allActivities;

		for (var i = 0; i < allActivities.length; ++i) {
			$scope.bookmarks.push(false);
		}
	});


	$("#searchBar").keyup(function(e){
	    if (e.keyCode == 13) {
	    	$scope.activities = [];
			$scope.bookmarks = [];
	    	Activity.getList({limit:100}).then(function(allActivities) {
	    		allActivities.sort(function(a,b){return b.vote - a.vote});
				for (var i = 0; i < allActivities.length; ++i) {
					var thisActivity = allActivities[i];
					if (thisActivity.title.includes($("#searchBar").val())) {
						$scope.activities.push(thisActivity);
						if ($scope.loggedInUser) {
							if (thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
								$scope.bookmarks.push(true);
							} else {
								$scope.bookmarks.push(false);
							}
						}
					}
				}
			});
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

          $scope.bookmarks = [];
          Activity.getList({limit:100}).then(function(allActivities) {
          	  allActivities.sort(function(a,b){return b.vote - a.vote});
          	  $scope.activities = allActivities;
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
			User.getList({username:$scope.loggedInUser}).then(function(userRes) {
				var thisUser = userRes[0];
				if (thisUser.likes.includes(thisActivity.title)) {
					thisUser.likes.splice(thisUser.likes.indexOf(thisActivity.title), 1);
					thisActivity.vote--;
					$('#upBtn' + index).removeClass('btn-success');
					$('#upBtn' + index).addClass('btn-light');
				} else {
					if (thisUser.dislikes.includes(thisActivity.title)) {
						thisUser.dislikes.splice(thisUser.dislikes.indexOf(thisActivity.title), 1);
						thisActivity.vote++;
						$('#downBtn' + index).removeClass('btn-danger');
					}
					thisUser.likes.push(thisActivity.title);
					thisActivity.vote++;
					$('#upBtn' + index).removeClass('btn-light');
					$('#upBtn' + index).addClass('btn-success');
				}
			
				$scope.activities[index] = thisActivity;
				thisActivity.put();
				thisUser.put();
				//$scope.activities[index] = thisActivity;
			});		
		});
	};

	$scope.downVote = function(index) {
		Activity.getList({title:$scope.activities[index].title}).then(function(activityRes) {
			var thisActivity = activityRes[0];
			User.getList({username:$scope.loggedInUser}).then(function(userRes) {
				var thisUser = userRes[0];
				if (thisUser.dislikes.includes(thisActivity.title)) {
					thisUser.dislikes.splice(thisUser.dislikes.indexOf(thisActivity.title), 1);
					thisActivity.vote++;
					$('#downBtn' + index).removeClass('btn-danger');
					$('#downBtn' + index).addClass('btn-light');
				} else {
					if (thisUser.likes.includes(thisActivity.title)) {
						thisUser.likes.splice(thisUser.likes.indexOf(thisActivity.title), 1);
						thisActivity.vote--;
						$('#upBtn' + index).removeClass('btn-success');
					}
					thisUser.dislikes.push(thisActivity.title);
					thisActivity.vote--;
					$('#downBtn' + index).removeClass('btn-light');
					$('#downBtn' + index).addClass('btn-danger');
				}
			
				$scope.activities[index] = thisActivity;
				thisActivity.put();
				thisUser.put();
				// $scope.activities[index] = thisActivity;
			});		
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

	$scope.applyLikes = function(bookmarkIndex) {
		if ($('#upBtn' + bookmarkIndex).hasClass('btn-light')) {
			$('#upBtn' + bookmarkIndex).removeClass('btn-light');
		}
		if ($('#downBtn' + bookmarkIndex).hasClass('btn-danger')) {
			$('#downBtn' + bookmarkIndex).removeClass('btn-danger');
		}
		if (!$('#upBtn' + bookmarkIndex).hasClass('btn-success')) {
			$('#upBtn' + bookmarkIndex).addClass('btn-success');
		}
	}

	$scope.applyDislikes = function(bookmarkIndex) {
		if ($('#downBtn' + bookmarkIndex).hasClass('btn-light')) {
			$('#downBtn' + bookmarkIndex).removeClass('btn-light');
		}
		if ($('#upBtn' + bookmarkIndex).hasClass('btn-success')) {
			$('#upBtn' + bookmarkIndex).removeClass('btn-success');
		}
		if (!$('#downBtn' + bookmarkIndex).hasClass('btn-danger')) {
			$('#downBtn' + bookmarkIndex).addClass('btn-danger');
		}
	}

	$scope.showBookmarks = function() {
		if ($scope.loggedInUser) {
			$scope.activities = [];
			$scope.bookmarks = [];

			Activity.getList({limit:100}).then(function(allActivities) {
				allActivities.sort(function(a,b){return b.vote - a.vote});

				User.getList({username:$scope.loggedInUser}).then(function(userRes) {
					var thisUser = userRes[0];

					for (var i = 0; i < allActivities.length; ++i) {
						var thisActivity = allActivities[i];
						if (thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
							$scope.activities.push(thisActivity);
							$scope.bookmarks.push(true);

							if (thisUser.likes.includes(allActivities[i].title)) {
								var bookmarkIndex = $scope.activities.length-1;
								setTimeout($scope.applyLikes, 100, bookmarkIndex);
							} else if (thisUser.dislikes.includes(allActivities[i].title)) {
								var bookmarkIndex = $scope.activities.length-1;
								setTimeout($scope.applyDislikes, 100, bookmarkIndex);
							}
						}
					}
				});
			});
		}
	};

	$scope.showAll = function() {
		if ($scope.loggedInUser) {
			$scope.activities = [];
			$scope.bookmarks = [];

			Activity.getList({limit:100}).then(function(allActivities) {
				allActivities.sort(function(a,b){return b.vote - a.vote});

				User.getList({username:$scope.loggedInUser}).then(function(userRes) {
					var thisUser = userRes[0];

					for (var i = 0; i < allActivities.length; ++i) {
						var thisActivity = allActivities[i];
						$scope.activities.push(thisActivity);

						if (thisUser.likes.includes(allActivities[i].title)) {
							var bookmarkIndex = $scope.activities.length-1;
							setTimeout($scope.applyLikes, 100, bookmarkIndex);
						} else if (thisUser.dislikes.includes(allActivities[i].title)) {
							var bookmarkIndex = $scope.activities.length-1;
							setTimeout($scope.applyDislikes, 100, bookmarkIndex);
						}

						if (thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
							$scope.bookmarks.push(true);

						} else {
							$scope.bookmarks.push(false);
						}
					}
				});
			});
		}
	};

	$scope.applyFilters = function() {
		if ($scope.locationF === 'All') {
			$('#locationFilterBtn').text('Location');
			if ($scope.priceF === 'All') {
				$('#priceFilterBtn').text('Cost');
				$scope.bookmarks = [];
		        Activity.getList({limit:100}).then(function(allActivities) {
		        	allActivities.sort(function(a,b){return b.vote - a.vote});
		          	$scope.activities = allActivities;
		          	for (var i = 0; i < allActivities.length; ++i) {
						if ($('#upBtn' + i).hasClass('btn-success')) {
							$('#upBtn' + i).removeClass('btn-success');
							$('#upBtn' + i).addClass('btn-light');
						}
						if ($('#downBtn' + i).hasClass('btn-danger')) {
							$('#downBtn' + i).removeClass('btn-danger');
							$('#downBtn' + i).addClass('btn-light');
						}

					}
					if ($scope.loggedInUser) {
						User.getList({username:$scope.loggedInUser}).then(function(userRes) {
							var thisUser = userRes[0];

							for (var i = 0; i < allActivities.length; ++i) {
								var thisActivity = allActivities[i];
								if (thisUser.likes.includes(allActivities[i].title)) {
									var bookmarkIndex = i;
									setTimeout($scope.applyLikes, 100, bookmarkIndex);
								} else if (thisUser.dislikes.includes(allActivities[i].title)) {
									var bookmarkIndex = i;
									setTimeout($scope.applyDislikes, 100, bookmarkIndex);
								}
								
								if (thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
									$scope.bookmarks.push(true);

								} else {
									$scope.bookmarks.push(false);
								}
							}
						});
			        } else {
			          	for (var i = 0; i < allActivities.length; ++i) {
							$scope.bookmarks.push(false);
						}
			        }
				});
			} else {
				$('#priceFilterBtn').text($scope.priceF);
				$scope.bookmarks = [];
		        Activity.getList({cost:$scope.priceF, limit:100}).then(function(allActivities) {
		        	allActivities.sort(function(a,b){return b.vote - a.vote});
		          	$scope.activities = allActivities;
		          	for (var i = 0; i < allActivities.length; ++i) {
						if ($('#upBtn' + i).hasClass('btn-success')) {
							$('#upBtn' + i).removeClass('btn-success');
							$('#upBtn' + i).addClass('btn-light');
						}
						if ($('#downBtn' + i).hasClass('btn-danger')) {
							$('#downBtn' + i).removeClass('btn-danger');
							$('#downBtn' + i).addClass('btn-light');
						}

					}
					if ($scope.loggedInUser) {
			        	User.getList({username:$scope.loggedInUser}).then(function(userRes) {
							var thisUser = userRes[0];

							for (var i = 0; i < allActivities.length; ++i) {
								var thisActivity = allActivities[i];
								if (thisUser.likes.includes(allActivities[i].title)) {
									var bookmarkIndex = i;
									setTimeout($scope.applyLikes, 100, bookmarkIndex);
								} else if (thisUser.dislikes.includes(allActivities[i].title)) {
									var bookmarkIndex = i;
									setTimeout($scope.applyDislikes, 100, bookmarkIndex);
								}
								
								if (thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
									$scope.bookmarks.push(true);

								} else {
									$scope.bookmarks.push(false);
								}
							}
						});
			        } else {
			          	for (var i = 0; i < allActivities.length; ++i) {
							$scope.bookmarks.push(false);
						}
			        }
				});
			}
		} else {
			$('#locationFilterBtn').text($scope.locationF);
			if ($scope.priceF === 'All') {
				$('#priceFilterBtn').text('Cost');
				$scope.bookmarks = [];
		        Activity.getList({location:$scope.locationF, limit:100}).then(function(allActivities) {
		        	allActivities.sort(function(a,b){return b.vote - a.vote});
		          	$scope.activities = allActivities;
		          	for (var i = 0; i < allActivities.length; ++i) {
						if ($('#upBtn' + i).hasClass('btn-success')) {
							$('#upBtn' + i).removeClass('btn-success');
							$('#upBtn' + i).addClass('btn-light');
						}
						if ($('#downBtn' + i).hasClass('btn-danger')) {
							$('#downBtn' + i).removeClass('btn-danger');
							$('#downBtn' + i).addClass('btn-light');
						}

					}
					if ($scope.loggedInUser) {
			        	User.getList({username:$scope.loggedInUser}).then(function(userRes) {
							var thisUser = userRes[0];

							for (var i = 0; i < allActivities.length; ++i) {
								var thisActivity = allActivities[i];
								if (thisUser.likes.includes(allActivities[i].title)) {
									var bookmarkIndex = i;
									setTimeout($scope.applyLikes, 100, bookmarkIndex);
								} else if (thisUser.dislikes.includes(allActivities[i].title)) {
									var bookmarkIndex = i;
									setTimeout($scope.applyDislikes, 100, bookmarkIndex);
								}
								
								if (thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
									$scope.bookmarks.push(true);

								} else {
									$scope.bookmarks.push(false);
								}
							}
						});
			        } else {
			          	for (var i = 0; i < allActivities.length; ++i) {
							$scope.bookmarks.push(false);
						}
			        }
				});
			} else {
				$('#priceFilterBtn').text($scope.priceF);
				$scope.bookmarks = [];
		        Activity.getList({cost:$scope.priceF, location:$scope.locationF, limit:100}).then(function(allActivities) {
		        	allActivities.sort(function(a,b){return b.vote - a.vote});
		          	$scope.activities = allActivities;
		          	for (var i = 0; i < allActivities.length; ++i) {
						if ($('#upBtn' + i).hasClass('btn-success')) {
							$('#upBtn' + i).removeClass('btn-success');
							$('#upBtn' + i).addClass('btn-light');
						}
						if ($('#downBtn' + i).hasClass('btn-danger')) {
							$('#downBtn' + i).removeClass('btn-danger');
							$('#downBtn' + i).addClass('btn-light');
						}

					}
					if ($scope.loggedInUser) {
			        	User.getList({username:$scope.loggedInUser}).then(function(userRes) {
							var thisUser = userRes[0];

							for (var i = 0; i < allActivities.length; ++i) {
								var thisActivity = allActivities[i];
								if (thisUser.likes.includes(allActivities[i].title)) {
									var bookmarkIndex = i;
									setTimeout($scope.applyLikes, 100, bookmarkIndex);
								} else if (thisUser.dislikes.includes(allActivities[i].title)) {
									var bookmarkIndex = i;
									setTimeout($scope.applyDislikes, 100, bookmarkIndex);
								}
								
								if (thisActivity.bookmarkUsers.includes($scope.loggedInUser)) {
									$scope.bookmarks.push(true);

								} else {
									$scope.bookmarks.push(false);
								}
							}
						});
			        } else {
			          	for (var i = 0; i < allActivities.length; ++i) {
							$scope.bookmarks.push(false);
						}
			        }
				});
			}
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

		setTimeout(function() {
			if (!alreadyExists) {
				User.post(newU).then(function() {
		          $scope.loggedInUser = newU.username;

		          $scope.bookmarks = [];
				  Activity.getList({limit:100}).then(function(allActivities) {
				  	allActivities.sort(function(a,b){return b.vote - a.vote});
		          	$scope.activities = allActivities;
		          	for (var i = 0; i < allActivities.length; ++i) {
						if ($('#upBtn' + i).hasClass('btn-success')) {
							$('#upBtn' + i).removeClass('btn-success');
							$('#upBtn' + i).addClass('btn-light');
						}
						if ($('#downBtn' + i).hasClass('btn-danger')) {
							$('#downBtn' + i).removeClass('btn-danger');
							$('#downBtn' + i).addClass('btn-light');
						}

						$scope.bookmarks.push(false);
					}
				  });
		        });
			} else {
				alert("Sorry, the username \'" + $scope.registerUsername + "\' is already taken. Please choose another.");
			}

			$('#register-username').val(undefined);
			$('#register-password').val(undefined);
			//$('#new-activity').modal('hide');
		}, 300);
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

	          $scope.bookmarks = [];
	          Activity.getList({limit:100}).then(function(allActivities) {
	          	allActivities.sort(function(a,b){return b.vote - a.vote});
		        $scope.activities = allActivities;
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

			User.getList({username:$scope.loggedInUser}).then(function(userRes) {
				var thisUser = userRes[0];

				Activity.getList({limit:100}).then(function(allActivities) {
		          	allActivities.sort(function(a,b){return b.vote - a.vote});
			        $scope.activities = allActivities;
			        for (var i = 0; i < allActivities.length; ++i) {
			        	if (thisUser.likes.includes(allActivities[i].title)) {
							$('#upBtn' + i).removeClass('btn-light');
							$('#upBtn' + i).addClass('btn-success');
						} else if (thisUser.dislikes.includes(allActivities[i].title)) {
							$('#downBtn' + i).removeClass('btn-light');
							$('#downBtn' + i).addClass('btn-danger');
						}
			        }
				  });
			});

			$('#login-username').val(undefined);
			$('#login-password').val(undefined);
			//$('#new-activity').modal('hide');
		}, 300);
	};

	$scope.logoutUser = function() {
		$scope.loggedInUser = undefined;

		$scope.bookmarks = [];

		Activity.getList({limit:100}).then(function(allActivities) {
			allActivities.sort(function(a,b){return b.vote - a.vote});
		    $scope.activities = allActivities;
			for (var i = 0; i < allActivities.length; ++i) {
				if ($('#upBtn' + i).hasClass('btn-success')) {
					$('#upBtn' + i).removeClass('btn-success');
					$('#upBtn' + i).addClass('btn-light');
				}
				if ($('#downBtn' + i).hasClass('btn-danger')) {
					$('#downBtn' + i).removeClass('btn-danger');
					$('#downBtn' + i).addClass('btn-light');
				}

				$scope.bookmarks.push(false);
			}
		});
	};

});
