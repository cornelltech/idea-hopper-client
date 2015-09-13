'use strict';

angular.module('unicornucopia.ideas.controllers', [])

.controller('IdeasListController', ['$rootScope', '$scope', '$stateParams', '$q', 'Blessing',
  function($rootScope, $scope, $stateParams, $q, Blessing) {

    var syncBlessings = function(){
      var deferred = $q.defer();
      Blessing.getBlessings()
        .then(function(s){
          if(s.status==200){
            deferred.resolve(s.data.results);
          }else{
            console.error('error');
            deferred.reject('');
          }
        }, function(e){
          console.error(e);
          deferred.reject(e);
        });

      return deferred.promise;
    };

    var syncBlessingIdeas = function(id){
      var deferred = $q.defer();
      Blessing.getBlessingIdeas(id)
        .then(function(s){
          if(s.status==200){
            deferred.resolve(s.data.results);
          }else{
            console.error('error');
            deferred.reject('');
          }
        }, function(e){
          console.error(e);
          deferred.reject(e);
        });

      return deferred.promise;
    };


    $scope.selectBlessing = function(id){
      $scope.loadingIdeas = true;
      $scope.focusedBlessing = id;
    };

    $scope.loadingIdeas = true;
    $scope.ideas = null;
    $scope.$watch('focusedBlessing', function(newValue, oldValue) {
      if(newValue){
        var sync = syncBlessingIdeas(newValue);
        sync.then(function(ideas){
          $scope.ideas = ideas;
          $scope.loadingIdeas = false;
        })
        
        var blessing = $scope.blessings.filter(function(obj){ return obj.id == newValue; });
        $rootScope.$broadcast('focusedBlessing', blessing);
      }
    });


    $scope.sortParam = 'time';
    $scope.sortIdeas = function(param){
      if(param=='unicorns'){
        $scope.sortParam = 'unicorns'
        $scope.ideas.sort(function(a,b){
          if(a.upvoter_count < b.upvoter_count){
            return 1;
          }else if(a.upvoter_count > b.upvoter_count){
            return -1;
          }else{
            return 0;  
          }
        });
      }else if(param=='comments'){
        $scope.sortParam = 'comments'
        $scope.ideas.sort(function(a,b){
          if(a.comments_count < b.comments_count){
            return 1;
          }else if(a.comments_count > b.comments_count){
            return -1;
          }else{
            return 0;  
          }
        });
      }else if(param=='time'){
        $scope.sortParam = 'time'
        $scope.ideas.sort(function(a,b){
          var aDate = new Date(a.time_created);
          var bDate = new Date(b.time_created);
          if(aDate < bDate){
            return 1;
          }else if(aDate > bDate){
            return -1;
          }else{
            return 0;  
          }
        });
      }
    };

    $scope.$on('commentedOnIdea', function(evt, idea){
      $scope.ideas.filter(function(obj){ return obj.id == idea.id; })[0].comments_count += 1;
    });

    $scope.$on('unicornedIdea', function(evt, idea){
      $scope.ideas.filter(function(obj){ return obj.id == idea.id; })[0].upvoter_count = idea.upvoter_count;
      $scope.ideas.filter(function(obj){ return obj.id == idea.id; })[0].liked = idea.liked;
    });

    $scope.$on('deletedIdea', function(evt, idea){
      for(var i=0; i<$scope.ideas.length; i++){
        if($scope.ideas[i].id==idea.id){
          $scope.ideas.splice(i, 1);
          break;
        }
      }
    });


    $scope.blessings = null;
    $scope.focusedBlessing = null;
    var init = function(){
      var sync = syncBlessings();
      sync.then(function(blessings){
       $scope.blessings = blessings;
       if($stateParams.blessingId){
        $scope.focusedBlessing = $stateParams.blessingId;
       }else{
        $scope.focusedBlessing = blessings[0].id;
       }
      })
    }; init();


}])

.controller('IdeaCreateController', ['$scope', '$q', '$state', 'Account', 'Idea', 
  function($scope, $q, $state, Account, Idea) {

    $scope.idea = {'idea': '', 'accounts': [], 'blessings': []};

    $scope.me = null;
    var syncAccount = function(){
      var deferred = $q.defer();
      Account.syncMe()
        .then(function(s){
          if(s.status==200){
            $scope.idea.accounts.push(s.data);
            deferred.resolve(s.data);
          }else{
            deferred.reject('');
          }
        }, function(e){
          console.error(e);
          deferred.reject('');
        });

      return deferred.promise;
    };

    $scope.searchForAccounts = function(q){
      var deferred = $q.defer();
      Account.queryAccounts(q)
        .then(function(s){
          deferred.resolve( s.data );
        }, function(e){console.error(e);});
        return deferred.promise;
    };

    $scope.$on('focusedBlessing', function(evt, blessing) {
      if( $scope.idea.blessings.length == 0 ){ 
        $scope.idea.blessings.push(blessing[0]); 
      }else{
        $scope.idea.blessings[0] = blessing[0];
      }
      
    });

    $scope.createIdea = function(){
      var idea = {};
      idea.idea = $scope.idea.idea;
      idea.accounts = [];
      for(var i=0; i<$scope.idea.accounts.length; i++){
        idea.accounts.push($scope.idea.accounts[i].id);
      }
      idea.blessings = [$scope.$parent.focusedBlessing];
      Idea.createIdea(idea)
        .then(function(s){
          if(s.status==201){
            $state.go('application.ideas.detail', {'id': s.data.id, 'blessingId': s.data.blessings[0]})
          }
        }, function(e){console.error(e);});
    };

    var init = function(){
      var sync = syncAccount()
    }; init();

}])

.controller('IdeaDetailController', ['$rootScope', '$scope', '$q', '$state', 'Account', 'Idea', 'Comment',
  function($rootScope, $scope, $q, $state, Account, Idea, Comment) {
  
    var id = $state.params.id;

    $scope.idea = null;
    var syncIdea = function(id){
      var deferred = $q.defer();
      Idea.getIdea(id)
        .then(function(s){
          if(s.status==200){
            deferred.resolve(s.data);
          }else{
            deferred.reject('');
          }
        }, function(e){
          console.error(e);
          deferred.reject('');
        });
      return deferred.promise;
    };

    $scope.deleteIdea = function(id){
      Idea.deleteIdea(id)
        .then(function(s){

        }, function(e){
          console.error(e);
        });
      $rootScope.$broadcast('deletedIdea', $scope.idea);
      $state.go('application.ideas.create', {'reload': true});
    };

    $scope.editing = false;
    $scope.toggleEditMode = function(){
      $scope.editing = !$scope.editing;
    };

    $scope.updateIdea = function(idea){
      var idea = {};
      idea.id = $scope.idea.id;
      idea.idea = $scope.idea.idea;
      idea.accounts = [];
      for(var i=0; i<$scope.idea.accounts.length; i++){
        idea.accounts.push($scope.idea.accounts[i].id);
      }
      idea.blessings = [$scope.$parent.focusedBlessing];

      Idea.updateIdea(idea)
        .then(function(s){
          if(s.status==200){
            $scope.idea.idea = s.data.idea;
            $scope.toggleEditMode();
          }else{
            console.error(e);
          }
        }, function(e){
          console.error(e);
        })
    };

    $scope.unicorn = function(){
      Idea.unicorn($scope.idea.id)
        .then(function(s){
          if(s.status==200){
            if($scope.idea.liked){
              $scope.idea.upvoter_count -= 1;  
              for(var i=0; i<$scope.idea.upvoters.length; i++){
                  if($scope.idea.upvoters[i].id==$scope.$parent.$parent.me.id){
                    $scope.idea.upvoters.splice(i, 1);
                    break;
                  }
                }
            }else{
              $scope.idea.upvoters.push($scope.$parent.$parent.me);
              $scope.idea.upvoter_count += 1;  
            }
            $scope.idea.liked = !$scope.idea.liked;
            $rootScope.$broadcast('unicornedIdea', $scope.idea);
          }
        }, function(e){
          console.error(e);
        })
    };


    $scope.comments = null;
    $scope.loadingComments = true;
    var syncIdeaComments = function(id){
      var deferred = $q.defer();
      Comment.getIdeaComments(id)
        .then(function(s){
          if(s.status==200){
            deferred.resolve(s.data.results);
            $scope.loadingComments = false;
          }else{
            deferred.reject('');
          }
        }, function(e){
          console.error(e);
          deferred.reject('');
        });
      return deferred.promise;
    };

    $scope.comment = {}
    $scope.postComment = function(){
      $scope.comment.account = $scope.$parent.$parent.me.id;
      Comment.postIdeaComment($scope.idea, $scope.comment)
        .then(function(s){
          if(s.status==201){
            var createdComment = s.data;
            createdComment.account = $scope.$parent.$parent.me;
            $scope.comments.unshift(createdComment);
            $rootScope.$broadcast('commentedOnIdea', $scope.idea);
          }
        }, function(e){
          console.error(e);
        });
      $scope.idea.comments_count += 1;
      $scope.comment = {};
    };

    $scope.searchForAccounts = function(q){
      var deferred = $q.defer();
      Account.queryAccounts(q)
        .then(function(s){
          deferred.resolve( s.data );
        }, function(e){console.error(e);});
        return deferred.promise;
    };

    var init = function(){
      var sync = syncIdea(id);
      sync.then(function(idea){
        $scope.idea = idea;
        
        syncIdeaComments(idea.id)
          .then(function(comments){
            $scope.comments = comments;
          });
      })
    }; init();

}]);