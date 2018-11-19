'use strict';

describe('Controller: ActivityAddCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ActivityAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivityAddCtrl = $controller('ActivityAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActivityAddCtrl.awesomeThings.length).toBe(3);
  });
});
