cs142App.controller('ProjectAddController', ['$scope', '$resource','$routeParams', '$http', '$location',
  function($scope, $resource, $routeParams, $http, $location) {
    $scope.main.currentView = "addProjectView"
    $scope.message = "";

    var selectedPhotoFile;   // Holds the last file selected by the user

    $scope.addPhoto = function(){
        $scope.uploadPhoto();
    };

    // Called on file selection - we simply save a reference to the file in selectedPhotoFile
    $scope.inputFileNameChanged = function (element) {
        selectedPhotoFile = element.files[0];
    };

        // Has the user selected a file?
    $scope.inputFileNameSelected = function () {
        return !!selectedPhotoFile;
    };

    // Upload the photo file selected by the user using a post request to the URL /photos/new
    $scope.createProject = function () {
        if (!$scope.inputFileNameSelected()) {
            console.error("uploadPhoto called with no selected file");
            return;
        }
        console.log('fileSubmitted', selectedPhotoFile);

        // Create a DOM form and add the file to it under the name uploadedphoto
        var domForm = new FormData();
        domForm.append('uploadedphoto', selectedPhotoFile);
        domForm.append('title', $scope.title);
        domForm.append('skills', $scope.skills.split(','));
        domForm.append('description', $scope.description);
        domForm.append('email', $scope.email);
        domForm.append('numVolunteers', $scope.numVolunteers);
        domForm.append('date', $scope.date);
        /*domForm.append('startTime', $scope.startTime);
        domForm.append('endTime', $scope.endTime);*/
        domForm.append('commitment', $scope.commitment);
        domForm.append('_location', $scope.location);

        // Using $http to POST the form
        $http.post('/add/project', domForm, { transformRequest: angular.identity, headers: {'Content-Type': undefined}})
        .then(function successCallback(){//(response){
            console.log("Callback was successful ");
            $location.path("/posts");
        }, function errorCallback(err){
            // Couldn't upload the photo. XXX  - Do whatever you want on failure.
            $scope.message = err.data;
        });
    };

    $scope.goto_project = function(id) {
      window.location = "#/project/" + id;
    };


  }]);
