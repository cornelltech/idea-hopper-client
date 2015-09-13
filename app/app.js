'use strict';

// Declare app level module which depends on views, and components
angular.module('unicornucopia', [
  'ngMaterial',
  'ui.router',
  'ngCookies',
  
  'unicornucopia.authentication.services',
  'unicornucopia.authentication.controllers',

  'unicornucopia.application.services',
  'unicornucopia.application.controllers',

  'unicornucopia.accounts.directives',
  'unicornucopia.accounts.services',
  'unicornucopia.accounts.controllers',

  'unicornucopia.ideas.directives',
  'unicornucopia.ideas.services',
  'unicornucopia.ideas.controllers',

  'unicornucopia.comments.directives',
  'unicornucopia.comments.services',
  'unicornucopia.comments.controllers'
  
])

.constant('API_VERSION', '1')
.constant('PREFIX', 'APP')
// .constant('DOMAIN', 'http://localhost:8000')
.constant('DOMAIN', 'http://unicornucopia-dev.elasticbeanstalk.com')

.config(['$mdThemingProvider', function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red');
}])

.config(function($mdIconProvider) {
    $mdIconProvider
      .icon('actions:unicorn', 'media/unicorn.svg', 21);
  })

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    $stateProvider
      .state('authentication', {
        url: '/authentication',  
        templateUrl: 'authentication/authentication.tmpl.html',
        controller: 'AuthenticationController'
      })

      .state('application',{
        url: '/application',
        templateUrl: 'application/application.tmpl.html',
        controller: 'ApplicationController'
      })

      .state('application.ideas',{
        url: '/ideas?blessingId',
        templateUrl: 'ideas/ideas.tmpl.html',
        controller: 'IdeasListController'
      })

      .state('application.ideas.create',{
        url: '/create',
        templateUrl: 'ideas/ideas.create.tmpl.html',
        controller: 'IdeaCreateController'
      })

      .state('application.ideas.detail',{
        url: '/detail/:id',
        templateUrl: 'ideas/ideas.detail.tmpl.html',
        controller: 'IdeaDetailController'
      })

      .state('application.account',{
        url: '/account/:id',
        templateUrl: 'accounts/account.tmpl.html',
        controller: 'AccountController'
      })

    $urlRouterProvider.otherwise('/application/ideas/create');
}])

.run(['$rootScope', '$state', '$urlRouter', 'Authentication', 
    function($rootScope, $state, $urlRouter, Authentication) {
      // check if the user is authenticated
      $rootScope.$on('$locationChangeSuccess', function(evt) {
        // Halt state change from even starting
        evt.preventDefault();
        // Verify the user has a session token
        try{
          var sessionToken = Authentication.getToken();
          // Continue with the update and state transition if logic allows
          if(sessionToken){
            $rootScope.authentication = {'status': true};
            $urlRouter.sync();
          }else{
            $rootScope.authentication = {'status': false};
            $state.go('authentication');
          }
        }catch(e){
          $rootScope.authentication = {'status': false};
          $state.go('authentication');
        }
        
    });

}]);
