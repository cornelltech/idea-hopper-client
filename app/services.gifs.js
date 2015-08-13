angular.module('unicorn.gifs.services', [])

.factory('Gif', ['$http', 
  function($http){
  
    var PUBLICKEY = 'dc6zaTOxFJmzC';

    var randomGif = function(){
      var response = $http({
                        url: 'https://api.giphy.com/v1/gifs/random?' + 'api_key=' + PUBLICKEY,
                        method: 'GET',
                        headers: { 
                          'Content-Type': 'application/json'
                        },
                        data: ''
                      });
      return response;
    }

  return{
    randomGif: randomGif
  };
}])