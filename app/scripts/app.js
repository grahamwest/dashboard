'use strict';


// Include app dependency on ngMaterial

var DashboardApp = angular.module( 'DashboardApp', [ 'ngMaterial', 'ngRoute' ] )
  .controller('NavController', function ($scope, $http) {

    $scope.db = {};

    $scope.resetDb = function() {
      $scope.db = {};
    };

    $scope.importDbJson = function(importData) {
      $scope.db = angular.extend({}, $scope.db, importData);

      // select default dashboard set to be first one in json if we don't already have on selected
      if (!$scope.selectedDashboardSetName) {
        $scope.selectedDashboardSetName = Object.keys($scope.db.dashboards)[0];
      }
    };

    $scope.importFromUrl = function(url) {
      // load dashboard data
      $http.get(url).success(function(data) {
        $scope.importDbJson(data);
      });
    };

    $scope.showSidebar = true;
    $scope.showSidebarLocked = true;

    $scope.toggleSidebar = function() {
      $scope.showSidebar = !$scope.showSidebar;
    };

    $scope.toggleSidebarLock = function() {
      $scope.showSidebarLocked = !$scope.showSidebarLocked;
    };


    // load default data
    $scope.importFromUrl('dashboard-data.json');

  });

DashboardApp.controller('DashboardController', function ($scope, $routeParams) {

  var resolveDashboardNode = function( tree, path ) {
    if (path.length === 0) {
      return tree;
    }

    return resolveDashboardNode( tree.dashboards[path[0]], path.slice(1) );
  };

  var pathTokens = $routeParams.path.split('/');
  var dashboard = resolveDashboardNode($scope.$parent.db, pathTokens);

  $scope.$parent.selectedDashboardSetName = pathTokens[0];
  $scope.$parent.selectedDateName = pathTokens[1];
  $scope.$parent.selectedAreaName = pathTokens[2];
  $scope.$parent.selectedTeamName = pathTokens[3];

  $scope.title = dashboard.title;
  $scope.data = dashboard.data;


  $scope.ancestors = pathTokens
    .slice(0, pathTokens.length - 1)
    .map(function(v, i, tokens) {
      var path = tokens.slice(0, i + 1);
      var n = resolveDashboardNode($scope.$parent.db, path);
      return {
        title: n.title,
        path: path.join('/'),
        name: path[i]
      };
    }).slice(1);


  $scope.viewUrl = function() {
    return 'views/dashboards/' + dashboard.view + '.html';
  };

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


DashboardApp.filter('humanize', function() {
  // modifid from https://gist.github.com/juanpujol/5835379
  return function(text) {
    if(text) {
      text = text.split(/[- ]/);

      // go through each word in the text and capitalize the first letter
      for (var i in text) {
        var word = text[i];
        word = word.toLowerCase();
        word = word.charAt(0).toUpperCase() + word.slice(1);
        text[i] = word;
      }

      return text.join(' ');
    }
  };
});