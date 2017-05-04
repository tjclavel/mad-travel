cs142App.controller('ProjectPostingsController', ['$scope',
  function($scope) {
    
    $scope.addProject = function() {
      window.location.href = "#/add/project";
    };

    $scope.pendingProject = {};
    $scope.showTitle = false;

    $scope.addingProject = function() {
      $scope.pendingProject.image = "/images/doge.jpeg";
      $scope.projects.push($scope.pendingProject);
      window.location.href = "#/posts";
    };

    $scope.removeProject = function(i) {
      $scope.projects.splice(i, 1);
      window.location.href = "#/posts";
    };

  }]);
