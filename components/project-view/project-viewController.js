cs142App.controller('ProjectViewController', ['$scope', '$routeParams','$resource',
  function($scope, $routeParams, $resource) {


    var projectId = $routeParams.id;

    var Project = $resource('/project/:projectId', {projectId:'@projectId'});
    Project.get({projectId: projectId}, function(project) {
      $scope.project = project;

      var date = new Date($scope.project.date);
      $scope.project.date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
      var date2 = new Date($scope.project.startTime);
      $scope.project.startTime = date2.getHours();
      if($scope.project.startTime < 12) {
        if(date2.getMinutes() !== 0) {
          $scope.project.startTime += ":" + date2.getMinutes();
        }
        $scope.project.startTime += "AM";
      } else {
        $scope.project.startTime -= 12;
        if(date2.getMinutes() !== 0) {
          $scope.project.startTime += ":" + date2.getMinutes();
        }
        $scope.project.startTime += "PM";
      }
      var date3 = new Date($scope.project.endTime);
      $scope.project.endTime = date3.getHours();
      if($scope.project.endTime < 12) {
        if(date3.getMinutes() !== 0) {
          $scope.project.endTime += ":" + date3.getMinutes();
        }
        $scope.project.endTime += "AM";
      } else {
        $scope.project.endTime -= 12;
        if(date3.getMinutes() !== 0) {
          $scope.project.endTime += ":" + date3.getMinutes();
        }
        $scope.project.endTime += "PM";
      }
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
      var mail = {from: $scope.interest.email, to: $scope.project.email, subject: "Interest in your community project!", text: $scope.interest.name + " is interested in your project! Get in contact with them by emailing " + $scope.interest.email};
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
  }]);