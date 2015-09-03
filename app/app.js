/**
*  Module
*
* Description
*/
angular.module('CTunicornucopia', ['ngMaterial', 
                                   'ui.router', 
                                   'ngCookies',

                                   'unicorn.accounts.directives',
                                   'unicorn.accounts.services',
                                   'unicorn.accounts.controllers',
                                   'unicorn.authentication.controllers',
                                   'unicorn.authentication.services',
                                   'unicorn.toolbar.controllers',
                                   'unicorn.comments.services',
                                   'unicorn.blessings.services',
                                   'unicorn.ideas.services',
                                   'unicorn.ideas.controllers',
                                   'unicorn.utilities.services',
                                   'unicorn.gifs.services'])

.constant('VERSION', 'v1')
// .constant('DOMAIN', 'http://localhost:8000')
.constant('DOMAIN', 'http://unicornucopia-dev.elasticbeanstalk.com')

.constant('COLORS', ['#F44336', '#E91E63', '#9C27B0', '#673AB7', 
                     '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', 
                     '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                     '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
                     '#795548', '#9E9E9E', '#607D8B'])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('red');
})

.config(function($mdIconProvider) {
    $mdIconProvider
      .icon('actions:unicorn', 'media/unicorn.svg', 21);
  })

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    //
    // For any unmatched url
    $urlRouterProvider.otherwise('/ideas/create')
    //
    // Set the states
    $stateProvider
      .state('authentication', {
        url: '/authentication',  
        templateUrl: 'partials/authentication.tmpl.html',
        controller: 'AuthenticationController'
      })

      .state('application',{
        templateUrl: 'partials/toolbar.tmpl.html',
        controller: 'ToolbarController'
      })

      .state('application.account', {
        url: '/account/:pk',  
        templateUrl: 'partials/account.tmpl.html',
        controller: 'AccountController'
      })

      .state('application.ideas', {
        url: '/ideas',  
        templateUrl: 'partials/ideas.tmpl.html',
        controller: 'IdeasController'
      })

      .state('application.ideas.create', {
        url: '/ideas/create',  
        templateUrl: 'partials/createidea.tmpl.html',
        controller: 'CreateIdeaController'
      })

      .state('application.ideas.idea', {
        url: '/ideas/:pk',
        templateUrl: 'partials/idea.tmpl.html',
        controller: 'IdeaController' 
      })

}])

.run(['$rootScope', '$state', '$urlRouter', 'Authentication', 
    function($rootScope, $state, $urlRouter, Authentication) {
      // check if the user is authenticated
      $rootScope.$on('$locationChangeSuccess', function(evt) {
        // Halt state change from even starting
        evt.preventDefault();
        // Verify the user has a session token
        var sessionToken = Authentication.getToken();
        // Continue with the update and state transition if logic allows
        if(sessionToken){
          $rootScope.authentication = {'status': true};
          $urlRouter.sync();
        }else{
          $rootScope.authentication = {'status': false};
          $state.go('authentication');
        }
    });
}])