angular.module('ideas.authentication.controllers', [])

.controller('AuthenticationController', ['$scope', '$state', '$mdDialog', 'Authentication',
  function($scope, $state, $mdDialog, Authentication){
    
    var login = function(user){
      Authentication.authenticateUser(user).then(function(s){
        if(s.status == 200){
          Authentication.cacheToken(s.data);
          $state.go('app.files');
        }else if(s.status == 400){
          console.log("Bad Credentials");
          $scope.authError = true;
        }else{
          console.log("Unkown Error");
        };
      }, function(e){console.log(e);$scope.authError = true;});
    };

    var register = function(user){
      if(user.password == user.confirm_password){          
        Authentication.registerUser(user).then(function(s){
          if(s.status==201){
            var auth = {};
            auth.username = user.username;
            auth.password = user.password;
            login(auth);
          }
        }, function(e){console.log(e);});
      }else{
        console.log("Passwords did not match");
        $scope.authError = true;
      };  
    };
    
    // Handle the Dialogs
    $scope.logInModal = function(ev) {
      $mdDialog.show({
        controller: LogInController,
        templateUrl: 'app/authentication/templates/login.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function() {
        }, function() {
      });
    };
  
    var LogInController = function($scope, $mdDialog) {
      $scope.login = function(user){
        login(user);
        $scope.hide();
      };

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };
    
    $scope.signUpModal = function(ev) {
      $mdDialog.show({
        controller: SignUpController,
        templateUrl: 'app/authentication/templates/signup.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function() {
        }, function() {
      });
    };
  
    var SignUpController = function($scope, $mdDialog) {
      $scope.register = function(user){
        register(user);
        $scope.hide();
      };

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };

}]);
