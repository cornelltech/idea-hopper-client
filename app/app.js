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
                               'ideas.comments.services',
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

.controller('CreateIdeaController', ['$scope', '$mdDialog', 'ideas', 
  function($scope, $mdDialog, ideas){

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  
}])

.controller('AppController', ['$rootScope', '$scope', '$mdDialog', 'Authentication', 'Account', 'Idea',
  function($rootScope, $scope, $mdDialog, Authentication, Account, Idea){

    /*
     * Authentication Section
     */

    // Authentication Verification
    $scope.isAuthenticated = Authentication.getToken() != undefined;
    $scope.$on('authenticated', function(){
      $scope.isAuthenticated = true;
      sync();
    });


    /*
     * Data sync section
     */

    // Account Sync
    $scope.account = null;
    var syncAccount = function(){
      Account.me()
        .then(function(s){
          if(s.status==200){
            return s.data;
          }
        }, function(e){console.log(e);})
        .then(function(account){
          $rootScope.account = account;
          $scope.account = account;
        }, function(e){console.log(e);});
    };

    // Ideas Sync
    $scope.ideas = {count: 0, next: null, prev: null, content: []};
    var syncIdeas = function(){
      Idea.getIdeas()
        .then(function(s){
          if(s.status==200){
            return s.data;
          }
        }, function(e){console.log(e);})
        .then(function(ideas){
          $scope.ideas = ideas;
        }, function(e){console.log(e);});
    };


    // Master Sync
    var sync = function(){
      syncAccount();
      syncIdeas();
    }; if($scope.isAuthenticated){ sync(); }

    
    /*
     * Action Bindings
     */

    $rootScope.focusedIdea = false;
    $scope.focusOnIdea = function(ev, idea){
      $rootScope.focusedIdea = idea;
      $scope.ideaDetails(ev);
    };
    
    $scope.upvoteIdea = function(idea){
      Idea.upvote(idea.id)
        .then(function(s){
        }, function(e){console.log(e);});
    };

    $scope.logout = function(){
      Authentication.logout();
      $scope.isAuthenticated = false;
    };



    /*
     * Dialog Configurations
     */

    // Create Idea Dialog
    $scope.ideaDetails = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/ideas/templates/ideaDetails.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function() {
        }, function() {
      });
    };
    $scope.createIdea = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/ideas/templates/createIdea.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function() {
        }, function() {
      });
    };
    // Registraion Dialog
    $scope.registerDialog = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/authentication/templates/register.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function() {
        }, function() {
      });
    };
    // Login Dialog
    $scope.loginDialog = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/authentication/templates/login.dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function() {
        }, function() {
      });
    };

    // Dialog Controller
    var DialogController = function($scope, $mdDialog){
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };
}])


.controller('IdeaController', ['$rootScope', '$scope', '$mdDialog', 'Comment',
  function($rootScope, $scope, $mdDialog, Comment){

    $scope.idea = $rootScope.focusedIdea;
    $scope.idea.tags = ["art", "social", "jokes"]

    // Sync Comments for Idea
    $scope.comments = null;
    var syncComments = function(){
      Comment.getIdeaComments($scope.idea.id)
        .then(function(s){
          if(s.status==200){
            return s.data;
          }
        }, function(e){console.log(s);})
        .then(function(comments){
          $scope.comments = comments;
        }, function(e){console.log(e);});
    };


    var sync = function(){
      syncComments();
    }; sync();


    $scope.postComment = function(comment){
      comment.idea = $scope.idea.id;
      comment.account = $rootScope.account.id;
      Comment.postComment(comment)
        .then(function(s){
          if(s.status==201){
            $scope.comment = {};
            return s.data;
          }
        }, function(e){console.log(e);})

        .then(function(comment){
          $scope.comments.results.unshift(comment);
          $scope.comments.count += 1;
        }, function(e){console.log(e);});

    };


    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
}])


.controller('LoginController', ['$rootScope', '$scope', '$mdDialog', 'Authentication',
  function($rootScope, $scope, $mdDialog, Authentication){
    
    $scope.login = function(credentials){
      Authentication.authenticateCredentials(credentials)
        .then(function(s){
          var token = null;
          if(s.status == 200){
            token = s.data;
            return token;
          }else{
            // raise error
          }
        }, function(e){console.log(e);})

        .then(function(token){          
          Authentication.cacheToken(token);
          $rootScope.$broadcast('authenticated');
          $scope.hide();
        }, function(e){console.log(e);});
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
}])

.controller('RegisterController', ['$rootScope', '$scope', '$mdDialog', 'Authentication',
  function($rootScope, $scope, $mdDialog, Authentication){
    
    $scope.positions = [{"key": "ME", "value": "MEng"},
                        {"key": "MB", "value": "MBA"},
                        {"key": "CM", "value": "Connective Media"},
                        {"key": "HL", "value": "Healthy Life"},
                        {"key": "FC", "value": "Faculty"},
                        {"key": "PH", "value": "PhD Student"},
                        {"key": "PD", "value": "PostDoc"},
                        {"key": "DL", "value": "DevLab"},
                        {"key": "ST", "value": "Staff"}]

    $scope.register = function(user){
      Authentication.registerUser(user)
      .then(function(s){
        if(s.status==201){ return s.data }
      }, function(e){console.log(e);})

      .then(function(s){
        var credentials = {"password": user.password, "username": user.email };

        Authentication.authenticateCredentials(credentials)
        .then(function(s){
          var token = null;
          if(s.status == 200){
            token = s.data;
            return token;
          }else{
            // raise error
          }
        }, function(e){console.log(e);})

        .then(function(token){          
          Authentication.cacheToken(token);
          $rootScope.$broadcast('authenticated');
          $scope.hide();
        }, function(e){console.log(e);});

      }, function(e){console.log(s);})
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
}]);