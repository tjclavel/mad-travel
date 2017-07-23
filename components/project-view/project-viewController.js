cs142App.controller('ProjectViewController', ['$scope', '$routeParams','$resource', '$http', '$sce', '$mdDialog',
  function($scope, $routeParams, $resource, $http, $sce, $mdDialog) {
    $scope.main.currentView = "individualProjectView";

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
    $scope.countries = ["Philippines", "Australia", "Canada", "USA", "Other"];
    $scope.interest.country = ""; //set default value for dropdown.

    var DialogController = function ($scope, $mdDialog, interest, project) {

        $scope.closeDialog = function() {
          $mdDialog.hide();
        };

        $scope.contactCommunity = function(){
          var mail = {from: interest.email, to: project.email, subject: "Interest in your community project: " + project.title, 
            text: interest.name + " is interested in your project! Get in contact with them by emailing " + interest.email +
            ".\n\nWe asked " + interest.name + " why they are interested in your community's project. This is what they responded: \n\n" +
          interest.essay};

          var response = $resource('/sendmail').save(mail, function(){
            console.log("Email sent!");
          });


          var volunteerObj = {name: interest.name, email: interest.email, country: interest.country};

          var SignUp = $resource('/volunteer_signed_up/' + projectId);
          SignUp.save({volunteer: volunteerObj}, function(project){
            console.log("number of volunteers increased");
            console.log(project.volunteers);
            window.location.href = "#/posts";
            $mdDialog.hide();
          }); 
        };
    }

    $scope.sendInterest = function(){
      $mdDialog.show({
          template:
            '<md-dialog aria-label="Dialog">' +
            '  <md-dialog-actions>' +
            '    <md-button ng-click="closeDialog()">' +
            '      Back' +
            '    </md-button>' +
            '    <md-button ng-click="contactCommunity()">' +
            '      Send email' +
            '    </md-button>' +
            '  </md-dialog-actions>' +
            '  <md-dialog-content>' +
            '    Thank you for your interest in making a difference. To get you started on this project, we will send an email to the community with your details. Once we contact the community, the community head will email you as soon as possible :)' + 
            '  </md-dialog-content>' +
            '</md-dialog>',
          controller: DialogController,
          locals: {
            interest: $scope.interest,
            project: $scope.project
          }
      });
    };

  }
]);