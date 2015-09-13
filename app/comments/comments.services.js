'use strict';

angular.module('unicornucopia.comments.services', [])

.factory('Comment', ['$http', 'Authentication', 'DOMAIN', 'API_VERSION',
  function($http, Authentication, DOMAIN, API_VERSION){

    var getIdeaComments = function(id){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/ideas/' + id + '/comments/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var postIdeaComment = function(idea, comment){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v' + API_VERSION + '/ideas/' + idea.id + '/add/comments/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: comment
                      });
      return response;
    };

    return{
      getIdeaComments: getIdeaComments,
      postIdeaComment: postIdeaComment
    };
}]);
