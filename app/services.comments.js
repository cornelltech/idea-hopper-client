angular.module('unicorn.comments.services', [])

.factory('Comment', ['$http', 'Authentication', 'VERSION', 'DOMAIN',
  function($http, Authentication, VERSION, DOMAIN){
  
    var getIdeaComments = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/ideas/' + pk + '/comments/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var postComment = function(comment){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/comments/',
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: comment
                      });
      return response;
    };

    var postIdeaComment = function(idea, comment){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/ideas/' + idea.id + '/add/comments/',
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
}])