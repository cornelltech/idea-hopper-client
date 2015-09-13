'use strict';

angular.module('unicornucopia.ideas.directives', [])

.directive('idealistitem', [function(){
  return {
    scope: {
      idea: '='
    },
    restrict: 'E',
    templateUrl: 'ideas/idea.listitem.directive.tmpl.html',
    controller: function($scope, $element, $attrs, $transclude, Idea) {

      $scope.$watch("idea", function(newValue, oldValue){
        if(newValue != oldValue){ }
      });

      $scope.unicorn = function(){
        Idea.unicorn($scope.idea.id)
          .then(function(s){
            if(s.status==200){
              if($scope.idea.liked){
                $scope.idea.upvoter_count -= 1;  
              }else{
                $scope.idea.upvoter_count += 1;  
              }
              $scope.idea.liked = !$scope.idea.liked;
            }
          }, function(e){
            console.error(e);
          })
      };
    }
  };
}]);