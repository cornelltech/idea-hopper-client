angular.module('ideas.authentication.services', ['ngCookies'])

.factory('Authentication', ['$http', '$cookies','DOMAIN', 'VERSION',
  function($http, $cookies, DOMAIN, VERSION){

    var authenticateUser = function(credentials){
      var response = $http({
        url: DOMAIN + '/api/' + VERSION + '/api-token-auth/',
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        data: credentials
      });
      return response;
    };

    var registerUser = function(user){
      var response = $http({
        url: DOMAIN + '/api/' + VERSION + '/accounts/create/',
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        data: user
      });
      return response;
    };

    var getToken = function(){
      return $cookies.getObject('CTIHtoken');
    };

    var cacheToken = function(token){
      return $cookies.putObject('CTIHtoken', token, secure=true);
    };

    var logout = function(){
      $cookies.remove('CTIHtoken');
    };

    return{
      authenticateUser: authenticateUser,
      registerUser: registerUser,

      getToken: getToken,
      cacheToken: cacheToken,
      logout: logout
    };
}]);
