/**
* unicorn.accounts.controllers Module
*
* Description
*/
angular.module('unicorn.accounts.controllers', [])

.controller('AccountController', ['$scope', '$state', 'Account',
  function($scope, $state, Account){

    var accountID = $state.params.pk;

    $scope.ideas = {};
    var syncAccountIdeas = function(pk){
      Account.getAccountIdeas(pk)
        .then(function(s){
          if(s.status==200){
            return s.data;
          }
          else{throw "error getting account ideas";}
        }, function(e){console.log(e); throw e;})
        .then(function(accountIdeas){
          $scope.ideas = accountIdeas;
        }, function(e){console.log(e); throw e;})
    }; syncAccountIdeas(accountID)
  
}])