cs142App.controller('ProjectPostingsController', ['$scope',
  function($scope) {
    
    $scope.addProject = function() {
      window.location.href = "#/add/project";
    };

  }]);
