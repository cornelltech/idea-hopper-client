'use strict';

angular.module('unicornucopia.comments.directives', [])

.directive('comment', [function(){
  return {
    scope: {
      comment: '='
    },
    restrict: 'E',
    templateUrl: 'comments/comment.directive.tmpl.html',
    controller: function($scope, $element, $attrs, $transclude) {



    }
  };
}]);