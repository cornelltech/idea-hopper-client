angular.module('unicorn.toolbar.controllers', [])

.controller('ToolbarController', ['$rootScope', '$scope', '$state', 'Account',
  'Blessing', 'Authentication',
  function($rootScope, $scope, $state, Account, 
    Blessing, Authentication){

    $scope.state = $state.current.name;

    $scope.me = {};
    var syncMe = function(){
      Account.me()
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting account"; }
        }, function(e){console.log(e);})

        .then(function(me){
          $scope.me = me;
          $rootScope.me = me;
        }, function(e){console.log(e);});
    }; syncMe();

    $scope.blessings = {};
    var syncBlessings = function(){
      Blessing.getBlessings()
        .then(function(s){
          if(s.status==200){ return s.data; }
          else{ throw "error getting blessings"; }
        }, function(e){console.log(e);})

        .then(function(blessings){
          $scope.blessings = blessings;

          // load up the latest blessing
          $scope.broadcaseBlessing(blessings.results[0].id);

        }, function(e){console.log(e);});
    }; syncBlessings();
    

    $scope.broadcaseBlessing = function(id){
      $scope.selectedBlessing = id;
      $rootScope.selectedBlessingID = id;
      $rootScope.$broadcast('blessingSelection', id);
    };
    

    $scope.logout = function(){
        Authentication.logout();
        $state.go('authentication');
    };
}]);
