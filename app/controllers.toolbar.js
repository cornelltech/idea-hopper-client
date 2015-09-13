angular.module('unicorn.toolbar.controllers', [])

.controller('ToolbarController', ['$rootScope', '$scope', '$state', 'Account',
  'Blessing', 'Authentication',
  function($rootScope, $scope, $state, Account, 
    Blessing, Authentication){

    // capture the current state of the application
    $scope.state = $state.current.name;

    // sync the logged in user
    $scope.me = {};
    var syncMe = function(){
      Account.me()
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting account"; }
        }, function(e){ console.error(e); })
        .then(function(me){
          $scope.me = me;
          $rootScope.me = me;
        }, function(e){ console.error(e); });
    }; syncMe();

    // get a list of the blessings
    $scope.blessings = {};
    var syncBlessings = function(){
      Blessing.getBlessings()
        .then(function(s){
          if(s.status==200){ return s.data.results; }
          else{ throw "error getting blessings"; }
        })
        .then(function(blessings){

          $scope.blessings = blessings;
          // load up the latest blessing
          $scope.broadcastBlessing(blessings[0].id);

        }, function(e){ console.error(e); });
    }; syncBlessings();
    

    // emit a broadcast on blessing selection
    $scope.broadcastBlessing = function(id){
      $scope.selectedBlessing = id;
      $rootScope.selectedBlessingID = id;

      for(var i=0; i<$scope.blessings.length; i++){
        if($scope.blessings[i].id == id){
          $rootScope.currentBlessings = $scope.blessings[i].blessing;
        }
      }
      

      $rootScope.$broadcast('blessingSelection', id);
    };
    
    // handle logout flow
    $scope.logout = function(){
        Authentication.logout();
        $state.go('authentication');
    };
}]);
