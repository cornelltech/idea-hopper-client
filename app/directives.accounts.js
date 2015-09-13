angular.module('unicorn.accounts.directives', [])

.directive('avatar', ['Account', function(Account){
  return {
    scope: {
      account: '='
    },
    restrict: 'E',
    templateUrl: 'partials/avatar.directive.html',
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