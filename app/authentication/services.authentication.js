angular.module('ideas.authentication.services', [])

.factory('Authentication', ['$http', 'localStorageService','DOMAIN',
  function($http, localStorageService, DOMAIN){

    var authenticateUser = function(credentials){
      var response = $http({
        url: DOMAIN + '/api/v1/api-token-auth/',
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        data: credentials
      });
      return response;
    };

    var registerUser = function(user){
      var response = $http({
        url: DOMAIN + '/api/v1/accounts/create/',
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        data: user
      });
      return response;
    };

    var getToken = function(){
      return localStorageService.get('token');
    };

    var cacheToken = function(token){
      return localStorageService.set('token', token);
    };

    var logout = function(){
      localStorageService.remove('token');
    };

    return{
      authenticateUser: authenticateUser,
      registerUser: registerUser,

      getToken: getToken,
      cacheToken: cacheToken,
      logout: logout
    };
}]);
