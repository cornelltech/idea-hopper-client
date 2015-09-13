'use strict';

angular.module('unicornucopia.authentication.services', ['ngCookies'])

.factory('Authentication', ['$http', '$cookies', 'PREFIX', 'DOMAIN', 'API_VERSION',
  function($http, $cookies, PREFIX, DOMAIN, API_VERSION) {

    var authenticateCredentials = function(credentials) {
      var response = $http({
        url: DOMAIN + '/api/v' + API_VERSION + '/api-token-auth/',
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        data: credentials
      });
      return response;
    };

    var registerAccount = function(account) {
      var response = $http({
        url: DOMAIN + '/api/v' + API_VERSION + '/accounts/create/',
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        data: account
      });
      return response;
    };
  
    var cacheToken = function(token) {
      return $cookies.putObject(PREFIX+'token', token);
    };

    var getToken = function() {
      return $cookies.getObject(PREFIX+'token');
    };

    var removeToken = function() {
      $cookies.remove(PREFIX+'token');
    };

  return {
    authenticateCredentials: authenticateCredentials,
    registerAccount: registerAccount,
    cacheToken: cacheToken,
    getToken: getToken,
    removeToken: removeToken
  };

}])