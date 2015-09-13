'use strict';

angular.module('unicornucopia.accounts.directives', [])

.directive('avatar', [function(){
  return {
    scope: {
      account: '='
    },
    restrict: 'E',
    templateUrl: 'accounts/avatar.directive.tmpl.html',
    controller: function($scope, $element, $attrs, $transclude) {
      $scope.colorCoding = {
                          "ME": "#2196F3",
                          "MB": "#E91E63",
                          "CM": "#FF5722",
                          "HL": "#8BC34A",
                          "FC": "#9E9E9E",
                          "PH": "#9C27B0",
                          "PD": "#795548",
                          "DL": "#9C27B0",
                          "ST": "#607D8B"
      };
    }
  };
}]);