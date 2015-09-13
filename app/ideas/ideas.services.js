'use strict';

angular.module('unicornucopia.ideas.services', [])

.factory('Idea', ['$http', 'Authentication', 'DOMAIN', 'API_VERSION',
  function($http, Authentication, DOMAIN, API_VERSION){

    var unicorn = function(id){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/ideas/' + id + '/upvote/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var createIdea = function(idea){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/ideas/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: idea
                      });
      return response;
    };

    var updateIdea = function(idea){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/ideas/' + idea.id + '/update/',
                        method: 'PUT',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: idea
                      });
      return response;
    };

    var deleteIdea = function(id){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/ideas/' + id + '/',
                        method: 'DELETE',
                        headers: { 
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getIdea = function(id){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/ideas/' + id + '/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    return{
      unicorn: unicorn,
      createIdea: createIdea,
      updateIdea: updateIdea,
      deleteIdea: deleteIdea,
      getIdea: getIdea
    };
}])

.factory('Blessing', ['$http', 'Authentication', 'API_VERSION', 'DOMAIN',
  function($http, Authentication, API_VERSION, DOMAIN){
  
    var getBlessings = function(){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/blessings/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getBlessingIdeas = function(id){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/blessings/' + id + '/ideas/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    return{
      getBlessings: getBlessings,
      getBlessingIdeas: getBlessingIdeas
    };
}]);