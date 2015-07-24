angular.module('ideas.toolbar.controllers', [])

.controller('ToolbarController', ['$scope', '$state', 'Authentication',
    function($scope, $state, Authentication){

        $scope.logout = function(){
            Authentication.logout();
            $state.go('authentication');
        };
}]);
