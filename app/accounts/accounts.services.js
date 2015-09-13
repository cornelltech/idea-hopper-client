'use strict';

angular.module('unicornucopia.accounts.services', [])

.factory('Account', ['$http', 'Authentication', 'DOMAIN', 'API_VERSION',
  function($http, Authentication, DOMAIN, API_VERSION){

    var syncMe = function(){
        var token = Authentication.getToken();
        var response = $http({
                          url: DOMAIN + '/api/v' + API_VERSION + '/me/',
                          method: 'GET',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + token },
                        });
        return response;
      };

    var queryAccounts = function(q){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/accounts/search/?query='+q,
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };
    
    var getAccount = function(id){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/accounts/' + id + '/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getAccountIdeas = function(id){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/accounts/' + id + '/ideas/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getAccountUpvotedIdeas = function(id){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/accounts/' + id + '/upvotes/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    return{
      syncMe: syncMe,
      queryAccounts: queryAccounts,
      getAccount: getAccount,
      getAccountIdeas: getAccountIdeas,
      getAccountUpvotedIdeas: getAccountUpvotedIdeas

    };
}]);