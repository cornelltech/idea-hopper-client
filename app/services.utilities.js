/**
* unicorn.ideas.services Module
*
* Description
*/
angular.module('unicorn.utilities.services', [])

.factory('ErrorDispatcher', ['$rootScope', '$scope',
  function($rootScope, $scope){
  
    var throwError = function(e){
      throw e;
    };

    return{
      throwError: throwError
    };

}])