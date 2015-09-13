'use strict';

angular.module('unicornucopia.authentication.controllers', [])

.controller('AuthenticationController', ['$scope', '$q', '$state', 'Authentication',
  function($scope, $q, $state, Authentication) {

    $scope.positions = [{"key": "ME", "value": "MEng"},
                        {"key": "MB", "value": "MBA"},
                        {"key": "CM", "value": "Connective Media"},
                        {"key": "HL", "value": "Health Tech"},
                        {"key": "FC", "value": "Faculty"},
                        {"key": "PH", "value": "PhD Student"},
                        {"key": "PD", "value": "PostDoc"},
                        {"key": "DL", "value": "Dev Lab"},
                        {"key": "ST", "value": "Staff"}];


    var validate_field = function(fieldKey, value) {
      return true;
    };

    $scope.errorMessage = { 'flag': false, 'msg': null };
    var raiseError = function(e) {
      $scope.errorMessage.flag = true;
      $scope.errorMessage.msg = e;
    };

    var resetError = function() {
      $scope.errorMessage = { 'flag': false, 'msg': null };
    };

    var validateCredentials = function(credentials) {
      var deferred = $q.defer();
      Authentication.authenticateCredentials(credentials)
        .then(function(s){
          if(s.status==200){
            deferred.resolve(s.data);  
          }else{
            deferred.reject(e);
          }
        }, function(e){
          console.error(e);
          deferred.reject(e);
        });

      return deferred.promise;
    };

    var registerAccount = function(account) {
      var deferred = $q.defer();
      Authentication.registerAccount(account)
        .then(function(s){
          if(s.status==201){
            deferred.resolve(s.data);
          }else{
            console.error(e);
            deferred.reject(e);
          }
        }, function(e){
          console.error(e);
          deferred.reject(e);
        });
      return deferred.promise;
    };

    $scope.auth = function(account, mode) {

      if(mode=='signin'){
        var credentials = {'username': account.email, 'password': account.password};
        var auth = validateCredentials(credentials);
        auth.then(function(token){

          Authentication.cacheToken(token.token);

          $state.go('application.ideas.create');

        }, function(e){
          raiseError(e);
        });

      }else{

        var req = registerAccount(account)
        req.then(function(){

            var credentials = {'email': account.email, 'password': account.password};
            $scope.auth(credentials, mode='signin');

          }, function(e){
            raiseError(e);
          });

      }
    };
  
}]);