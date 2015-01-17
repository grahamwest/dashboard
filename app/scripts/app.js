'use strict';


// Include app dependency on ngMaterial

var DashboardApp = angular.module( 'DashboardApp', [ 'ngMaterial', 'ngRoute' ] )
  .controller('NavController', function ($scope) {


    $scope.db = {
      'slt' : {
        '2015-Q1': {
          'text': 'Hello'
        }
      },
      'strategy' : {
        '2015-Q1': {
          'text': 'bob'
        }
      },
      'function' : {
        '2015-01': {
          'engineering' : {
            'text' : 'moo'
          }
        }
      }
    };


    $scope.world = 'World!';
  });


DashboardApp.config(['$routeProvider', function( $routeProvider ){

  $routeProvider.when('/', {templateUrl: 'views/main.html'});

}]);

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