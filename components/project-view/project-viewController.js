cs142App.controller('ProjectViewController', ['$scope', '$routeParams','$resource',
  function($scope, $routeParams, $resource) {


    var projectId = $routeParams.id;

    var Project = $resource('/project/:projectId', {projectId:'@projectId'});
    Project.get({projectId: projectId}, function(project) {
      $scope.project = project;
    });


    /*console.log("from PV");
    console.log($scope.main.projects);

    $scope.project = $scope.main.projects[$routeParams.id];
    console.log($scope.main.projects);*/
    /*$scope.project = {};
    console.log($scope.projects);
    for(var i = 0; i < $scope.projects.length; i++) {
      if($scope.projects[i].id == $routeParams.id) {
        $scope.project = $scope.projects[i]
      }
    }*/

    $scope.interest = {};
    $scope.sendInterest = function() {
      var mail = {from: $scope.interest.email, to: $scope.project.email, subject: "Interest in your community project!", text: $scope.interest.name + " is interested in your project!"};
      $scope.senda(mail);
      window.location.href = "#/posts";
    };

    $scope.senda = function (mail) {
      $scope.loading = true;
      console.log(mail);
      var response = $resource('/sendmail').save(mail, function() {
        $scope.loading = false;
        $scope.serverMessage = "Email sent successfully";
      });
    };
  }])
