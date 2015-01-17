'use strict';


// Include app dependency on ngMaterial

angular.module( 'DashboardApp', [ 'ngMaterial' ] )
  .controller("NavController", function ($scope) {
    $scope.world = "World!"
  });

/*
angular.module('dashboardApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
*/