angular.module('ideas.authentication.services', ['ngCookies'])

.factory('Authentication', ['$rootScope', '$http', '$cookies','DOMAIN', 'VERSION',
  function($rootScope, $http, $cookies, DOMAIN, VERSION){

    var authenticateCredentials = function(credentials){
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

    var isAuthenticated = function(){
      var token = getToken();
      console.log('before if');
      if(token){
        console.log("after if")
        $rootScope.$broadcast('authenticated');
        console.log("broadcasted")
      }
    };

    return{
      authenticateCredentials: authenticateCredentials,
      registerUser: registerUser,

      getToken: getToken,
      cacheToken: cacheToken,
      logout: logout,
      
      isAuthenticated: isAuthenticated
    };
}]);
