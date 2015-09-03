angular.module('unicorn.ideas.controllers', [])

.controller('IdeasController', ['$rootScope', '$scope', 'Blessing', 'Idea',
  function($rootScope, $scope, Blessing, Idea){
  
    $scope.focusedIdeaID = -1;
    $scope.focusOnIdea = function(idea){
      $scope.focusedIdeaID = idea.id;
    };

    // handle the search input toggle
    $scope.searchFlag = false;
    $scope.toggleSearch = function(){
      $scope.search = '';
      $scope.searchFlag = !$scope.searchFlag;
    };

    // handle the ordering of the list
    $scope.orderingVar = '';
    $scope.orderingVarReverseFlag = false;
    $scope.toggleOrdering = function(param){
      if(param == $scope.orderingVar){
        $scope.orderingVarReverseFlag = !$scope.orderingVarReverseFlag;
      }
      $scope.orderingVar = param;
    };

    // sync the ideas in the blessing
    $scope.ideas = [];
    var selectedBlessing = -1;
    var syncBlessingIdeas = function(id){
      Blessing.getBlessingIdeas(id)
        .then(function(s){
          return s.data.results;
        })
        .then(function(ideas){

          // check if user liked idea
          for(var i=0; i<ideas.length; i++){
            for(var j=0; j<ideas[i].upvoters.length; j++){
              if($rootScope.me.id == ideas[i].upvoters[j].id){
                ideas[i].liked = true;
                break;
              }
            }
          }

          $scope.ideas = ideas;
          console.log(ideas);
        }, function(e){ console.error(e); });
    };

    // on blessing selection sync the ideas for that blessing
    $scope.$on('blessingSelection', function(evt, id){
      console.log("BLESSING SELECTED: " + id)
      selectedBlessing = id;
      syncBlessingIdeas(id);
    });

    // on idea creation resync the ideas
    $scope.$on('ideaCreated', function(evt, idea){
      syncBlessingIdeas(selectedBlessing);
    });

    // on idea deletion pop the idea off 
    $scope.$on('ideaDeleted', function(evt, idea){
      for(var i=0; i<$scope.ideas.length; i++){
        if($scope.ideas[i].id==idea.id){
          $scope.ideas.splice(i, 1);
          break;
        }
      }
    });

    $scope.$on('postedComment', function(evt, data){
      for(var i=0; i<$scope.ideas.length; i++){
        if($scope.ideas[i].id==data.idea.id){
          $scope.ideas[i].comments.push(data.comment);
          break;
        }
      }
    });

    // on idea like from the idea detail state
    $scope.$on('ideaDetailLiked', function(evt, idea){
      for(var i=0; i<$scope.ideas.length; i++){
        if($scope.ideas[i].id==idea.id){
          $scope.ideas[i].liked = idea.liked;
          $scope.ideas[i].upvoters = idea.upvoters;
          break;
        }
      }
    });

    $scope.upvoteIdea = function(idea){
      if(idea.liked){
        idea.liked = false;
        for(var i=0; i<idea.upvoters.length; i++){
          if(idea.upvoters[i].id==$rootScope.me.id){
            idea.upvoters.splice(i,1);
            break;
          }
        }
      }else{
        idea.liked = true;
        idea.upvoters.push($rootScope.me);
      }

      $rootScope.$broadcast('ideaLiked', idea);

      Idea.upvote(idea.id)
        .then(function(s){
          if(s.status==200){}
        }, function(e){console.error(e);});
    };


    $scope.convertTime = function(t){
      var t = new Date(t);
      return t.toLocaleTimeString() + ' ' + t.toLocaleDateString();
    };

}])


.controller('CreateIdeaController', ['$scope', '$rootScope', '$q', '$state', 'Account', 'Idea',
  function($scope, $rootScope, $q, $state, Account, Idea){
  
    // keep track of currently selected blessing
    var blessingID = $rootScope.selectedBlessingID;
    $scope.$on('blessingSelection', function(evt, id){
      blessingID = id;
    });

    $scope.me = {};
    var syncMe = function(){
      Account.me()
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting account"; }
        }, function(e){ console.error(e); })
        .then(function(me){
          $scope.me = me;
          $scope.authors.push(me);
        }, function(e){ console.error(e); });
    }; syncMe();

    $scope.authors = [];
    $scope.searchForAccounts = function(q){
      deferred = $q.defer();
      Account.queryAccounts(q)
        .then(function(s){
          console.log(s.data);
          deferred.resolve( s.data );
        }, function(e){console.error(e);});
        return deferred.promise;
    };

    // Create a new idea the idea
  
    $scope.createIdea = function(i){
      var idea = { "idea": $scope.idea,
                   "accounts": [],
                   "blessings": [blessingID] };

      for(var i=0; i<$scope.authors.length; i++){
        idea.accounts.push($scope.authors[i].id);
      }

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


.controller('IdeaController', ['$rootScope', '$scope', '$q', '$state', 'Account', 'Idea',
  'Comment',
  function($rootScope, $scope, $q, $state, Account, Idea, Comment){
  
    // get the id of the idea
    var pk = $state.params.pk;

    // flag whether or not the user authored the idea
    $scope.authored = false;

    // sync the idea
    $scope.idea = {};
    var syncIdea = function(){
      Idea.getIdea(pk)
        .then(function(s){
          return s.data;
        })
        .then(function(idea){
          // is the user an author
          for(var i=0; i<idea.accounts.length; i++){
            if($rootScope.me.id == idea.accounts[i].id){
              $scope.authored = true;
              break;  
            }
          }

          // is the user liked the idea
          for(var i=0; i<idea.upvoters.length; i++){
            if($rootScope.me.id == idea.upvoters[i].id){
              idea.liked = true;
              break;  
            }
          }

          // sync idea with the scope
          $scope.authors = idea.accounts;
          $scope.idea = idea;
        }, function(e){ console.error(e); })
    }; syncIdea();


    // sync the comments for the idea
    $scope.comments = {};
    var syncComments = function(){
      Comment.getIdeaComments(pk)
        .then(function(s){
          return s.data.results;
        })
        .then(function(comments){
          $scope.comments = comments;
        }, function(e){ console.error(e); });
    }; syncComments();

    // handle the creation of a comment
    $scope.comment = {"comment": ""};
    $scope.postComment = function(comment){
      comment.account = $rootScope.me.id;
      Comment.postIdeaComment($scope.idea, comment)
        .then(function(s){
          if(s.status==201){
            $scope.comment = {"comment": ""};
            return s.data;
          }
        })

        .then(function(comment){
          comment.account = $rootScope.me;
          $scope.comments.unshift(comment);
          $rootScope.$broadcast('postedComment', {"idea":$scope.idea, "comment": comment});
        }, function(e){console.error(e);});
    };

    // upvote an idea
    $scope.upvoteIdea = function(idea){
      if(idea.liked){
        idea.liked = false;
        for(var i=0; i<idea.upvoters.length; i++){
          if(idea.upvoters[i].id==$rootScope.me.id){
            idea.upvoters.splice(i,1);
            break;
          }
        }
      }else{
        idea.liked = true;
        idea.upvoters.push($rootScope.me);
      }

      $rootScope.$broadcast('ideaDetailLiked', idea);

      Idea.upvote(idea.id)
        .then(function(s){
          if(s.status==200){}
        }, function(e){console.error(e);});
    };

    $scope.$on('ideaLiked', function(evt, idea){
      $scope.idea.liked = idea.liked;
      $scope.idea.upvoters = idea.upvoters;
    });


    // Editing mode
    $scope.editing = false;
    $scope.toggleEditMode = function(){
      $scope.editing = !$scope.editing;
    };

    $scope.me = {};
    var syncMe = function(){
      Account.me()
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting account"; }
        }, function(e){ console.error(e); })
        .then(function(me){
          $scope.me = me;
          $scope.authors.push(me);
        }, function(e){ console.error(e); });
    }; syncMe();


    $scope.authors = [];
    $scope.searchForAccounts = function(q){
      deferred = $q.defer();
      Account.queryAccounts(q)
        .then(function(s){
          console.log(s.data);
          deferred.resolve( s.data );
        }, function(e){console.error(e);});
        return deferred.promise;
    };

    $scope.saveEdit = function(){
      var editedIdea = {
        "id": $scope.idea.id,
        "idea": $scope.idea.idea,
        "accounts": [],
      };

      for(var i=0; i<$scope.authors.length; i++){
        editedIdea.accounts.push($scope.authors[i].id);
      }

      Idea.updateIdea(editedIdea)
        .then(function(s){
          
        }, function(e){console.error(e);});
      
      $scope.toggleEditMode();

    };

    // Handle item deletion
    $scope.deleteIdea = function(){
      Idea.deleteIdea($scope.idea.id)
        .then(function(s){console.log(s)}, function(e){console.log(e);});
      $rootScope.$broadcast('ideaDeleted', $scope.idea);
      $state.go('^');
    };

    $scope.convertTime = function(t){
      var t = new Date(t);
      return t.toLocaleTimeString() + ' ' + t.toLocaleDateString();
    };


}])