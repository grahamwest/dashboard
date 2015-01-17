'use strict';


// Include app dependency on ngMaterial

var DashboardApp = angular.module( 'DashboardApp', [ 'ngMaterial', 'ngRoute' ] )
  .controller('NavController', function ($scope, $http) {

    // load dashboard data
    $http.get('dashboard-data.json').success(function(data) {
      $scope.db = data;

      // select default set to be first one in json
      if (!$scope.selectedDashboardSetName) {
        $scope.selectedDashboardSetName = Object.keys($scope.db.dashboards)[0];
      }
    });

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
  $scope.view = dashboard.view;
  $scope.data = dashboard.data;
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
  // from https://gist.github.com/juanpujol/5835379
  return function(text) {
    if(text) {
      text = text.split('-');

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