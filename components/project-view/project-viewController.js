cs142App.controller('ProjectViewController', ['$scope', '$routeParams','$resource',
  function($scope, $routeParams, $resource) {

    var projectId = $routeParams.id;

    var Project = $resource('/project/' + projectId);
    Project.get(function(project) {
      $scope.project = project;

      var date = new Date($scope.project.date);
      $scope.project.date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
      /*var date2 = new Date($scope.project.startTime);
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
      }*/
    });

    $scope.interest = {};
    $scope.countries = ["Philippines", "Australia", "Canada", "USA"];
    $scope.interest.country = "Philippines"; //set default value for dropdown

    $scope.sendInterest = function() {
      var mail = {from: $scope.interest.email, to: $scope.project.email, subject: "Interest in your community project: " + $scope.project.title, text: $scope.interest.name + " is interested in your project! Get in contact with them by emailing " + $scope.interest.email};

      var response = $resource('/sendmail').save(mail, function(){
        console.log("Email sent!");
      });

      var volunteerObj = {name: $scope.interest.name, email: $scope.interest.email, country: $scope.interest.country};

      var SignUp = $resource('/volunteer_signed_up/' + projectId);
      SignUp.save({volunteer: volunteerObj}, function(project){
          console.log("number of volunteers increased");
          console.log(project.volunteers);
      });

      window.location.href = "#/posts";

    };

  }]);