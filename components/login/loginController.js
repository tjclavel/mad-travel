cs142App.controller('LoginController', ['$scope',
    function ($scope) {

      $scope.title = 'Login';

      $scope.login = {};

      $scope.attemptLogin = function() {
        if($scope.login.password === "doggo") {
          $scope.main.asAdministrator = true;
          window.location = "#/posts";
        }
      };

    }]);
