cs142App.controller('ProjectViewController', ['$scope', '$routeParams','$resource', '$http', '$sce',
  function($scope, $routeParams, $resource, $http, $sce) {

    var projectId = $routeParams.id;

    var Project = $resource('/project/' + projectId);
    Project.get(function(project) {
      $http({
        method: 'GET',
        url: '/download_image/' + project.image_id,
        responseType: 'arraybuffer'
      }).then(function(response) {
          var file = new Blob([response.data], {type: 'image/jpeg'});
          var fileURL = URL.createObjectURL(file);
          project.image_url = $sce.trustAsResourceUrl(fileURL);
          var date = new Date(project.date);
          project.date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
          $scope.project = project;
      })
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