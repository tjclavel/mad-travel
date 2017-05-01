cs142App.controller('ProjectPostingsController', ['$scope',
  function($scope) {
    
    $scope.addProject = function() {
      window.location.href = "#/add/project";
    };

    $scope.pendingProject = {};

    $scope.addingProject = function() {
      $scope.projects.push($scope.pendingProject);
      window.location.href = "#/posts";
    };

    $scope.removeProject = function(i) {
      $scope.projects.splice(i, 1);
      window.location.href = "#/posts";
    };

  }]);
