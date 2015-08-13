angular.module('unicorn.ideas.controllers', [])

.controller('IdeasController', ['$rootScope', '$scope', 'Blessing', 'Idea',
  function($rootScope, $scope, Blessing, Idea){
  
    $scope.blessingIdeas = {};
    var syncBlessingIdeas = function(id){
      Blessing.getBlessingIdeas(id)
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "Error getting ideas"; }
        }, function(e){console.log(e);})

        .then(function(ideas){
          $scope.blessingIdeas = ideas;
        }, function(e){ console.log(e); });
    };

    $scope.$on('blessingSelection', function(evt, id){
      syncBlessingIdeas(id);
    });


    $scope.upvoteIdea = function(idea){
      Idea.upvote(idea.id)
        .then(function(s){
          if(s.status==200){idea.upvotes += 1;}
        }, function(e){console.log(e);});
    };

}])

.controller('IdeaController', ['$rootScope', '$scope', '$state', 'Idea',
  'Comment', 'Gif',
  function($rootScope, $scope, $state, Idea, Comment, Gif){
  
    var pk = $state.params.pk;

    $scope.idea = {};
    var syncIdea = function(){
      Idea.getIdea(pk)
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting idea"; }
        }, function(e){ console.log(e); })

        .then(function(idea){
          $scope.idea = idea;
        }, function(e){ console.log(e); })
    }; syncIdea();

    $scope.comments = {};
    var syncComments = function(){
      Comment.getIdeaComments(pk)
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting comments"; }
        }, function(e){console.log(e);})

        .then(function(comments){
          $scope.comments = comments;
        }, function(e){ console.log(e); });
    }; syncComments();

     $scope.postComment = function(comment){
      comment.idea = $scope.idea.id;
      comment.account = $rootScope.me.id;
      Comment.postComment(comment)
        .then(function(s){
          if(s.status==201){
            $scope.comment = {};
            return s.data;
          }
        }, function(e){console.log(e);})

        .then(function(comment){
          comment.account = $rootScope.me;
          $scope.comments.results.unshift(comment);
          $scope.comments.count += 1;
        }, function(e){console.log(e);});

    };

    $scope.upvoteIdea = function(idea){
      Idea.upvote(idea.id)
        .then(function(s){
          if(s.status==200){idea.upvotes += 1;}
        }, function(e){console.log(e);});
    };


}])