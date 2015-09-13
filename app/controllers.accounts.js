/**
* unicorn.accounts.controllers Module
*
* Description
*/
angular.module('unicorn.accounts.controllers', [])

.controller('AccountController', ['$scope', '$state', 'Account',
  function($scope, $state, Account){

    var accountID = $state.params.pk;

    $scope.account = {};
    var syncAccount = function(pk){
      Account.getAccount(pk)
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting account"; }
        }, function(e){throw e;})
        .then(function(account){
          $scope.account = account;
        }, function(e){throw e;});
    }; syncAccount(accountID);

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
    }; syncAccountIdeas(accountID);


    $scope.unicornedIdeas = {};
    var syncAccountUnicornedIdeas = function(pk){
      Account.getAccountUpvotedIdeas(pk)
        .then(function(s){
          if(s.status==200){
            return s.data;
          }
          else{throw "error getting account unicorned ideas";}
        }, function(e){console.log(e); throw e;})
        .then(function(accountIdeas){
          $scope.unicornedIdeas = accountIdeas;
        }, function(e){console.log(e); throw e;})
    }; syncAccountUnicornedIdeas(accountID);
  
}])