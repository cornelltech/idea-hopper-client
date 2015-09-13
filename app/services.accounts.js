angular.module('unicorn.accounts.services', [])

.factory('Account', ['$http', 'Authentication', 'DOMAIN',
  function($http, Authentication, DOMAIN){
    var me = function(){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/me/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var getAccount = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/accounts/' + pk + '/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getAccounts = function(){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/accounts/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getAccountIdeas = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/accounts/' + pk + '/ideas/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getAccountUpvotedIdeas = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/accounts/' + pk + '/upvotes/',
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
                        url: DOMAIN + '/api/v1/accounts/search/?query='+q,
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    }

    return{
      me: me,
      getAccount: getAccount,
      getAccounts: getAccounts,
      getAccountIdeas: getAccountIdeas,
      getAccountUpvotedIdeas: getAccountUpvotedIdeas,
      queryAccounts: queryAccounts
    };
}])