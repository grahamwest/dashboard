'use strict';


// Include app dependency on ngMaterial

var DashboardApp = angular.module( 'DashboardApp', [ 'ngMaterial', 'ngRoute', 'angularFileUpload' ] )
  .controller('NavController', function ($scope, $http) {

    $scope.db = {};

    $scope.resetDb = function() {
      $scope.db = {};
    };

    var extendDeep = function extendDeep(dst) {
      angular.forEach(arguments, function(obj) {
        if (obj !== dst) {
          angular.forEach(obj, function(value, key) {
            if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
              extendDeep(dst[key], value);
            } else {
              dst[key] = value;
            }
          });
        }
      });
      return dst;
    };

    $scope.importFromJson = function(importData) {
      $scope.db = extendDeep($scope.db, importData);

      // select default dashboard set to be first one in json if we don't already have on selected
      if (!$scope.selectedDashboardSetName) {
        $scope.selectedDashboardSetName = Object.keys($scope.db.dashboards)[0];
      }

    };

    $scope.importFromUrl = function(url) {
      // load dashboard data
      $http.get(url).success(function(data) {
        $scope.importFromJson(data);
      });
    };

    $scope.importFromFile = function(file) {
      var reader = new FileReader();
      reader.addEventListener('load', function() {
        var jsonData = JSON.parse(reader.result);
        $scope.importFromJson(jsonData);
        $scope.$digest();
      });

      reader.readAsText(file);
    };

    $scope.showSidebar = true;
    $scope.showSidebarLocked = true;

    $scope.toggleSidebar = function() {
      $scope.showSidebar = !$scope.showSidebar;
    };

    $scope.toggleSidebarLock = function() {
      $scope.showSidebarLocked = !$scope.showSidebarLocked;
    };

    $scope.dropFiles = [];
    $scope.$watch('dropFiles', function() {
      for (var i = 0; i < $scope.dropFiles.length; i++) {
        var file = $scope.dropFiles[i];
        $scope.importFromFile(file);
      }
    });

    // load default data
    $scope.importFromUrl('dashboard-data.json');

  });

DashboardApp.controller('DashboardController', function ($scope, $routeParams, $location) {

  var resolveDashboardNode = function( tree, path ) {
    if (path.length === 0) {
      return tree;
    }

    try {
      return resolveDashboardNode( tree.dashboards[path[0]], path.slice(1) );
    } catch (e) {
      $location.path('/');
      return {};
    }
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


DashboardApp.directive('value', function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    templateUrl: 'directives/traffic-light.html',
    scope: {
      'label': '@',
      'value': '=',
      'unit': '=',
      'lowIsGood': '=',
      'thresholds': '='
    },
    link: function(scope) {

      scope.color = 'gray';

      var determineColorClass = function(value, thresholds, lowIsGood) {

        var thresholdGroup = 0;
        // thresholds is an array used to determine where the boundaries between red/amber/green are
        thresholds.some(function(threshold) {
          if (value > threshold)
          {
            thresholdGroup++;
          }
          return threshold > value;
        });

        // pick color based on thresholds
        var colors = ['red', 'amber', 'green'];

        if (lowIsGood) {
          colors = colors.reverse();
        }

        return colors[thresholdGroup];
      };

      scope.$watchGroup(['thresholds', 'lowIsGood'], function() {
        if (scope.thresholds) {
          scope.color = determineColorClass(scope.value, scope.thresholds, scope.lowIsGood);
        }
      });
      
    }
  };
});