/**
*  Module
*
* Description
*/
angular.module('idea-hopper', ['ngMaterial', 
                               'ui.router', 
                               'LocalStorageModule',
                               'ngCookies',

                               'ideas.accounts.services',
                               'ideas.authentication.controllers',
                               'ideas.authentication.services',
                               'ideas.toolbar.controllers',
                               'ideas.ideas.services'])

.constant('VERSION', 'v1')
.constant('DOMAIN', 'http://idea-hopper-api-dev.elasticbeanstalk.com')

.config(['localStorageServiceProvider',
    function(localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('ideas');
}])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
})

.controller('AppController', ['$scope', '$mdDialog', 'Authentication', 'Account', 'Idea',
  function($scope, $mdDialog, Authentication, Account, Idea){
  
    $scope.ideas = {count: 0, next: null, prev: null, content: []};



    var sync = function(){
      
      Account.me().then(function(s){
        $scope.account = s.data;
      }, function(e){console.log(e);});


      Idea.getIdeas().then(function(s){
        $scope.ideas.count = s.data.count;
        $scope.ideas.next = s.data.next;
        $scope.ideas.prev = s.data.prev;
        $scope.ideas.content = s.data.results;
      }, function(e){console.log(e);});

    };









    var token = Authentication.getToken();
    if(token==null){
      $scope.authenticationRequired = true;
    }else{
      sync();
    };



    $scope.upvoteIdea = function(idea){
      Idea.upvote(idea.id)
        .then(function(s){
        }, function(e){console.log(e);});
    };

    $scope.downvoteIdea = function(idea){
      Idea.downvote(idea.id)
        .then(function(s){
        }, function(e){console.log(e);});
    };








    // Create an idea
    $scope.createIdea = function(ev) {
      $mdDialog.show({
        controller: CreateIdeaController,
        templateUrl: 'app/ideas/templates/createIdea.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {ideas: $scope.ideas}
      }).then(function() {
        }, function() {
      });
    };
    var CreateIdeaController = function($scope, $mdDialog, ideas){
      $scope.submitIdea = function(idea){
        idea.upvotes = 0;
        idea.downvotes = 0;
        idea.accounts = [];
        idea.upvoters = [];
        idea.downvoters = [];
        Idea.createIdea(idea).then(function(s){
          ideas.count += 1;
          ideas.content.unshift(s.data);

          $scope.hide();
        }, function(e){console.log(e);});
      };

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };






    // Registreation
    $scope.registerDialog = function(ev) {
      $mdDialog.show({
        controller: RegisterController,
        templateUrl: 'app/authentication/templates/register.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function() {
        }, function() {
      });
    };
    var RegisterController = function($scope, $mdDialog){
      var login = function(user){
        Authentication.authenticateUser(user).then(function(s){
          if(s.status == 200){
            Authentication.cacheToken(s.data);
            $scope.hide();            
          }else if(s.status == 400){
            console.log("Bad Credentials");
            $scope.authError = true;
          }else{
            console.log("Unkown Error");
          };
        }, function(e){console.log(e);$scope.authError = true;});
      };
      var register = function(user){
        Authentication.registerUser(user).then(function(s){
          if(s.status==201){
            var auth = {};
            auth.username = user.username;
            auth.password = user.password;
            login(auth);
          }
        }, function(e){console.log(e);});
      };
      $scope.register = function(user){
        console.log(user)
        register(user);
      };
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };



    // Login
    $scope.loginDialog = function(ev) {
      $mdDialog.show({
        controller: LoginController,
        templateUrl: 'app/authentication/templates/login.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function() {
        }, function() {
      });
    };
    var LoginController = function($scope, $mdDialog){
      var login = function(user){
        Authentication.authenticateUser(user).then(function(s){
          if(s.status == 200){
            Authentication.cacheToken(s.data);
            $scope.hide();            
          }else if(s.status == 400){
            console.log("Bad Credentials");
            $scope.authError = true;
          }else{
            console.log("Unkown Error");
          };
        }, function(e){console.log(e);$scope.authError = true;});
      };
      $scope.login = function(user){
        console.log(user)
        login(user);
      };
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };

}])