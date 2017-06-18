cs142App.controller('ProjectAddController', ['$scope', '$resource','$routeParams', '$http', '$location',
  function($scope, $resource, $routeParams, $http, $location) {
    //var projectId = $routeParams.id;
    $scope.message = "";

    // var Project = $resource('/project/' + projectId);
    // Project.get(function(project) {
    //   $scope.project = project;
    // });

    // $scope.addProject = function() {
    //     if($scope.project.image_file === undefined){
    //         $scope.message = "Please select an image for your project thumbnail";
    //         return;
    //     }
    //     $resource('/add/project').save({
    //         title: $scope.title,
    //         image_file: $scope.project.image_file,
    //         skills: $scope.skills.split(','),
    //         description: $scope.description,
    //         email: $scope.email,
    //         numVolunteers: $scope.numVolunteers
    //     }, function() {
    //         window.location = "#/posts";
    //     }, function(err){
    //         $scope.message = err.data;
    //     });
    //     //$scope.pendingProject.image = "/images/doge.jpeg";
        
    // }

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

        // Using $http to POST the form
        $http.post('/add/project', domForm
            , { transformRequest: angular.identity, headers: {'Content-Type': undefined}}
        ).then(function successCallback(){//(response){
            console.log("Callback was successful ");
            $location.path("/posts");
        }, function errorCallback(err){
            // Couldn't upload the photo. XXX  - Do whatever you want on failure.
            $scope.message = err.data;
        });

        // {domForm: domForm, 
        //         data: { 
        //             title: $scope.title,
        //             //image_file: $scope.project.image_file,
        //             skills: $scope.skills.split(','),
        //             description: $scope.description,
        //             email: $scope.email,
        //             numVolunteers: $scope.numVolunteers,
        //             //_location: $scope.location, !!Make sure you include the _ in the property
        //         }
        //     }

    };

    $scope.goto_project = function(id) {
      window.location = "#/project/" + id;
    };

    $scope.delete_project = function(projectId){
      var Project = $resource('/delete/project/:projectId', {projectId:'@projectId'});
      Project.save({projectId: projectId}, function() {
        console.log("Project deleted");
      });
    }

  }]);