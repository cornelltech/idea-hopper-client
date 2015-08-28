angular.module('unicorn.ideas.controllers', [])

.controller('IdeasController', ['$rootScope', '$scope', 'Blessing', 'Idea',
  function($rootScope, $scope, Blessing, Idea){
  
    $scope.searchFlag = false;
    $scope.toggleSearch = function(){
      $scope.search = '';
      $scope.searchFlag = !$scope.searchFlag;
    };

    $scope.orderingVar = '';
    $scope.orderingVarReverseFlag = false;
    $scope.toggleOrdering = function(param){
      if(param == $scope.orderingVar){
        $scope.orderingVarReverseFlag = !$scope.orderingVarReverseFlag;
      }
      $scope.orderingVar = param;
    };

    $scope.blessingIdeas = {};
    var selectedBlessing = -1;
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
      selectedBlessing = id;
      syncBlessingIdeas(id);
    });

    $scope.$on('ideaCreated', function(evt, idea){
      syncBlessingIdeas(selectedBlessing);
    });

    $scope.$on('ideaDeleted', function(evt, idea){
      for(var i=0; i<$scope.blessingIdeas.results.length; i++){
        if($scope.blessingIdeas.results[i].id==idea.id){
          $scope.blessingIdeas.results.splice(i, 1);
          break;
        }
      }
    });

    $scope.upvoteIdea = function(idea){

      if(idea.liked){
        idea.upvotes -= 1;
        idea.liked = false;
      }else{
        idea.upvotes += 1;
        idea.liked = true;
      }

      Idea.upvote(idea.id)
        .then(function(s){
          if(s.status==200){}
        }, function(e){console.log(e);});
    };

}])


.controller('CreateIdeaController', ['$scope', '$rootScope', '$state', 'Idea',
  function($scope, $rootScope, $state, Idea){
  
    var blessingID = $rootScope.selectedBlessingID;
    $scope.$on('blessingSelection', function(evt, id){
      blessingID = id;
    });

    $scope.idea = "";
    $scope.createIdea = function(){

      var idea = {
                    "idea": $scope.idea,
                    "upvotes": 0,
                    "downvotes": 0,
                    "comment_count": 0,
                    "accounts": [$rootScope.me.id],
                    "blessings": [blessingID],
                    "upvoters": [],
                    "downvoters": []
                };
    
      Idea.createIdea(idea)
        .then(function(s){
          if(s.status==201){ return s.data; }
          else{ throw "Error creating idea"; }
        }, function(e){console.log(e);})

        .then(function(idea){
          broadcaseIdeaCreation(idea);
          $state.go('application.ideas.idea', {'pk': idea.id});
        }, function(e){console.log(e);});
    };

    var broadcaseIdeaCreation = function(idea){
      $rootScope.$broadcast('ideaCreated', idea);
    };

}])


.controller('IdeaController', ['$rootScope', '$scope', '$state', 'Idea',
  'Comment', 'Gif',
  function($rootScope, $scope, $state, Idea, Comment, Gif){
  
    var pk = $state.params.pk;

    $scope.authored = false;

    $scope.idea = {};
    var syncIdea = function(){
      Idea.getIdea(pk)
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting idea"; }
        }, function(e){ console.log(e); })

        .then(function(idea){
          if($rootScope.me.id == idea.accounts[0]){
            $scope.authored = true;
          }
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

      if(idea.liked){
        idea.upvotes -= 1;
        idea.liked = false;
      }else{
        idea.upvotes += 1;
        idea.liked = true;
      }

      Idea.upvote(idea.id)
        .then(function(s){
          if(s.status==200){}
        }, function(e){console.log(e);});
    };


    $scope.editing = false;
    $scope.toggleEditMode = function(){
      $scope.editing = !$scope.editing;
    };

    $scope.saveEdit = function(){
      Idea.updateIdea($scope.idea)
        .then(function(s){console.log(s)}, function(e){console.log(e);});
      $scope.toggleEditMode();
    };

    $scope.deleteIdea = function(){
      Idea.deleteIdea($scope.idea)
        .then(function(s){console.log(s)}, function(e){console.log(e);});
      $rootScope.$broadcast('ideaDeleted', $scope.idea);
      $state.go('^');
    };


    $scope.convertTime = function(t){
      var t = new Date(t);
      return t.toDateString();
    };


}])