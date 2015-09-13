'use strict';

angular.module('unicornucopia.accounts.controllers', [])

.controller('AccountController', ['$scope', '$q', '$state', 'Account',
  function($scope, $q, $state, Account) {

    var accountID = $state.params.id;
    $scope.positions = {"ME": "MEng",
                        "MB": "MBA",
                        "CM": "Connective Media",
                        "HL": "Health Tech",
                        "FC": "Faculty",
                        "PH": "PhD Student",
                        "PD": "PostDoc",
                        "DL": "Dev Lab",
                        "ST": "Staff"};


    $scope.account = null;
    var syncAccount = function(id){
      var deferred = $q.defer();
      Account.getAccount(id)
        .then(function(s){
          if(s.status==200){
            deferred.resolve(s.data);
          }else{
            deferred.reject('');
          }
        }, function(e){
          console.error(e);
          deferred.reject('');
        })
      return deferred.promise;
    };

    $scope.loadingIdeasUnicorned = true;
    var syncIdeasUnicorned = function(id){
      var deferred = $q.defer();
      Account.getAccountUpvotedIdeas(id)
        .then(function(s){
          if(s.status==200){
            $scope.loadingIdeasUnicorned = false;
            deferred.resolve(s.data.results);
          }else{
            deferred.reject('');
          }
        }, function(e){
          console.error(e);
          deferred.reject('');
        });
      return deferred.promise;
    };

    $scope.loadingIdeasCreated = true;
    var syncIdeasCreated = function(id){
      var deferred = $q.defer();
      Account.getAccountIdeas(id)
        .then(function(s){
          if(s.status==200){
            $scope.loadingIdeasCreated = false;
            deferred.resolve(s.data.results);
          }else{
            deferred.reject('');
          }
        }, function(e){
          console.error(e);
          deferred.reject('');
        });
      return deferred.promise;
    };

    var init = function(){
      var sync = syncAccount(accountID);
      sync.then(function(account){
        $scope.account = account;
        syncIdeasUnicorned(account.id)
          .then(function(unicornedIdeas){
            $scope.unicornedIdeas = unicornedIdeas;
          });
        syncIdeasCreated(account.id)
          .then(function(createdIdeas){
            $scope.createdIdeas = createdIdeas;
          });
      })
    }; init();

}]);