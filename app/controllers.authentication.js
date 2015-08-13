angular.module('unicorn.authentication.controllers', [])

.controller('AuthenticationController', ['$scope', '$state', 'Authentication',
  function($scope, $state, Authentication){
    
    $scope.positions = [{"key": "ME", "value": "MEng"},
                        {"key": "MB", "value": "MBA"},
                        {"key": "CM", "value": "Connective Media"},
                        {"key": "HL", "value": "Healthy Life"},
                        {"key": "FC", "value": "Faculty"},
                        {"key": "PH", "value": "PhD Student"},
                        {"key": "PD", "value": "PostDoc"},
                        {"key": "DL", "value": "DevLab"},
                        {"key": "ST", "value": "Staff"}]


    var emailCheck = function(email){
      var domain = email.split("@")[1];
      if(domain=="cornell.edu"){ return true; }
      else{ return false; }
    };


    $scope.user = {};
    $scope.authenticate = function(user, mode){
      if(!emailCheck(user.email)){
        return false;
      }else{
        var pass = user.password;
        if(mode=='register'){
          Authentication.registerUser(user)
            .then(function(s){
              if(s.status==201){ return s.data; }
            }, function(e){console.log(e);})

            .then(function(user){
              var credentials = {"username": user.email, "password": pass};
              validateCredentials(credentials);
            }, function(e){console.log(e);})    
        }else if(mode=='signin'){
          var credentials = {"username": user.email, "password": pass};
          validateCredentials(credentials);
        }else{
          console.log("error");
        }
      }
    };

    var validateCredentials = function(credentials){
      Authentication.authenticateCredentials(credentials)
        .then(function(s){
          return s.data;
        }, function(e){console.log(e);})

        .then(function(token){
          Authentication.cacheToken(token.token);
          $state.go('application.ideas');

        }, function(e){console.log(e);});
    };

    
}]);
