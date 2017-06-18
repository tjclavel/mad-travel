cs142App.controller('ProjectPostingsController', ['$scope', '$resource', '$location',
  function($scope, $resource, $location) {

    console.log("from PP");
    console.log($scope.projects);

    $scope.addProject = function() {
      $location.path("/add/project");
    };

    var resource = $resource('/load/projects')
    $scope.main.projects = resource.query(function() {
      console.log($scope.main.projects);
    });

    // $scope.pendingProject = {};
    // $scope.addingProject = function() {
    //   $scope.pendingProject.image = "/images/doge.jpeg";
    //   $resource('/add/project').save({
    //     title: $scope.pendingProject.title,
    //     skills: $scope.pendingProject.skills,
    //     image: $scope.pendingProject.image,
    //     description: $scope.pendingProject.description,
    //     email: $scope.pendingProject.email,
    //     numVolunteers: $scope.pendingProject.numVolunteers,
    //     startTime: $scope.pendingProject.startTime,
    //     endTime: $scope.pendingProject.endTime,
    //     date: $scope.pendingProject.date,
    //     _location: $scope.pendingProject.location,
    //     commitment: $scope.pendingProject.commitment
    //   }, function() {
    //     window.location = "#/posts";
    //   });
    // }

/*    var projectsResource = $resource('/load/projects');
    var response = projectsResource.query({}, function() {
      $scope.projects = response;
    });

    $scope.pendingProject = {};
    //$scope.showTitle = false;

    $scope.addingProject = function() {
      //$scope.pendingProject.image = "/images/doge.jpeg";
      //$scope.pendingProject.id = $scope.curId;
      var addProjectResource = $resource('/add/project');
      var addProjectResponse = addProjectResource.save({
        email: "tjclavel@stanford.edu"
      }, function() {
        $scope.curId += 1;
        $scope.projects.push($scope.pendingProject);
        console.log("jahfaslf");
        console.log($scope.projects);
        window.location.href = "#/posts";
      });
    };

    $scope.removeProject = function(i) {
      $scope.projects.splice(i, 1);
      window.location.href = "#/posts";
    };
*/
    $scope.goto_project = function(id) {
      window.location = "#/project/" + id;
    };

  }]);
