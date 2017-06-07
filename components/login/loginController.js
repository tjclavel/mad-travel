cs142App.controller('LoginController', ['$scope', '$resource',
    function ($scope, $resource) {

      $scope.title = 'Login';

      $scope.login = {};

      $scope.attemptLogin = function() {
        var response = $resource("/admin/login").save({password: $scope.login.password}, function () {
          $scope.main.asAdministrator = true;
          window.location = "#/posts";
        });
      };

    }]);
