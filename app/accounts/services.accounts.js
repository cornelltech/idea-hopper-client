angular.module('ideas.accounts.services', [])

.factory('Account', ['$http', 'Authentication', 'localStorageService', 'DOMAIN',
  function($http, Authentication, localStorageService, DOMAIN){
    var me = function(){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/v1/me/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token.token },
                        data: ''
                      });
      return response;
    };
    
    var cacheMe = function(me){
      return localStorageService.set('me', me);
    };
    
    var getMe = function(){
      return localStorageService.get('me');
    };

    return{
      me: me,
      cacheMe: cacheMe,
      getMe: getMe    
    };
}]);
