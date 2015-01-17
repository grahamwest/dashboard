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
          'text': 'function',
          'engineering' : {
            'text' : 'moo'
          }
        }
      }
    };


    $scope.world = 'World!';
  });


DashboardApp.controller('DashboardController', function ($scope, $routeParams) {

  var resolveDashboardNode = function( tree, path ) {
    if (path.length === 0) {
      return tree;
    }

    return resolveDashboardNode( tree[path[0]], path.slice(1) );
  };

  var dashboard = resolveDashboardNode($scope.$parent.db, $routeParams.path.split('/'));

  $scope.message = dashboard.text;
});


DashboardApp.config(['$routeProvider', function( $routeProvider ){

  $routeProvider.when('/', {templateUrl: 'views/main.html'});
  $routeProvider.when('/:path*', {
    controller: 'DashboardController',
    templateUrl: function() {
      return 'views/dashboard.html';
    }
  });
  

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