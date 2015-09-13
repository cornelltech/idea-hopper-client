angular.module('unicorn.ideas.services', [])

.factory('Idea', ['$http', 'Authentication', 'DOMAIN',
  function($http, Authentication, DOMAIN){
    
    var createIdea = function(idea){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/ideas/',
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
                        url: DOMAIN + '/api/v1/ideas/' + idea.id + '/update/',
                        method: 'PUT',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                        data: idea
                      });
      return response;
    };

    var deleteIdea = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/ideas/' + pk + '/',
                        method: 'DELETE',
                        headers: { 
                          'Authorization': 'Token ' + token },
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
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    var getIdea = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/ideas/' + pk + '/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
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
                          'Authorization': 'Token ' + token },
                        data: ''
                      });
      return response;
    };

    return{
      createIdea: createIdea,
      updateIdea: updateIdea,
      deleteIdea: deleteIdea,
      getIdeas: getIdeas,
      getIdea: getIdea,
      upvote: upvote,
    };
}])

.factory('IdeaManager', ['$scope', 'Idea', 'Blessing',
  function($scope, Idea, Blessing){
    
    var count = 0;
    var next = null;
    var prev = null;

    var ideas = [];

    var syncBlessingIdeas = function(blessing){
      Blessing.getBlessingIdeas(blessing.id)
        .then(function(s){

          ideas = s.data.results;

        }, function(e){console.log(e);});
    };

    var getIdeas = function(){
      return ideas; 
    };

    var addIdea = function(idea){
      Idea.createIdea(idea)
        .then(function(s){
          return s.data;
        }, function(e){})

        .then(function(idea){
          
          Idea.getIdea(idea.id)
            .then(function(s){
              
              ideas.unshift(s.data);

            }, function(e){console.log(e);});
        });
    };

    var removeIdea = function(idea){
      Idea.deleteIdea(idea.id)
        .then(function(s){

          for(var i=0; i<idea.length; i++){
            if(ideas[i].id == idea.id){
              ideas.splice(i, 1);
              break;
            }
          }

        }, function(e){console.log(e);});
    };

    return{
      syncBlessingIdeas: syncBlessingIdeas,
      getIdeas: getIdeas,
      addIdea: addIdea,
      removeIdea: removeIdea
    };
}])
