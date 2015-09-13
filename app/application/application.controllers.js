'use strict';

angular.module('unicornucopia.application.controllers', [])

.controller('ApplicationController', ['$rootScope', '$scope', '$state', 'Account', 'Authentication',
  function($rootScope, $scope, $state, Account, Authentication) {

    $scope.me = null;
    var syncAccount = function(){
      Account.syncMe()
        .then(function(s){
          $scope.me = s.data;
        }, function(e){console.error(e);})
    };
    if( !$scope.me ){ syncAccount(); }
    else{  }


    $scope.logout = function(){ 
      Authentication.removeToken(); 
      $state.go('authentication'); 
    };
  
}]);