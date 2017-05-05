cs142App.controller('ProjectViewController', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.project = {};
    for(var i = 0; i < $scope.projects.length; i++) {
      if($scope.projects[i].id == $routeParams.id) {
        $scope.project = $scope.projects[i]
      }
    }

  }])
