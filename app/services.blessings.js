angular.module('unicorn.blessings.services', [])

.factory('Blessing', ['$http', 'Authentication', 'VERSION', 'DOMAIN',
  function($http, Authentication, VERSION, DOMAIN){
  
    var getBlessings = function(){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/blessings/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    var getBlessingIdeas = function(pk){
      var token = Authentication.getToken();
      var response = $http({
                        url: DOMAIN + '/api/' + VERSION + '/blessings/' + pk + '/ideas/',
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Token ' + token },
                      });
      return response;
    };

    return{
      getBlessings: getBlessings,
      getBlessingIdeas: getBlessingIdeas
    };
}])