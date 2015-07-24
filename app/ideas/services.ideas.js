angular.module('ideas.ideas.services', [])

.factory('Idea', ['$http', 'Authentication', 'DOMAIN',
  function($http, Authentication, DOMAIN){
    
    var createIdea = function(idea){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/ideas/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token.token },
                        data: idea
                      });
      return response;
    };

    var getIdeas = function(){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/ideas/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token.token },
                        data: ''
                      });
      return response;
    };

    var upvote = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/ideas/' + pk + '/upvote/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token.token },
                        data: ''
                      });
      return response;
    };

    var downvote = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/ideas/' + pk + '/downvote/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token.token },
                        data: ''
                      });
      return response;
    };

    return{
      createIdea: createIdea,
      getIdeas: getIdeas,
      upvote: upvote,
      downvote: downvote
    };
}]);
