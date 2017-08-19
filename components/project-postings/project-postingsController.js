cs142App.controller('ProjectPostingsController', ['$scope', '$resource', '$location', '$mdDialog', '$route', '$sce', '$http', '$q',
  function($scope, $resource, $location, $mdDialog, $route, $sce, $http, $q) {

    $scope.main.currentView = "projectsView";
    $scope.errorMessage = ""
    $scope.projectsCurrentlyLoading = true;

    $scope.addProject = function() {
      $location.path("/add/project");
    };

    var resource = $resource('/load/projects/' + $scope.main.sort_criteria);
    resource.query(function(projects){
      promises = [];
      blobs = [];
      projects.forEach(function(project){
        promises.push(
          $http.post('/thumbnail', {filename: project.filename}, {responseType: 'blob'})
          .then(function(response) {
            // var thumbnailBlob = new Blob([response.data], {type: 'image/jpeg'});
            // console.log(thumbnailBlob)
            // var fileURL = URL.createObjectURL(thumbnailBlob);
            // console.log(fileURL)
            // project.image_url = $sce.trustAsResourceUrl(fileURL);
            // var arrayBufferView = new Uint8Array(response.data);
            // var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
            // var urlCreator = window.URL || window.webkitURL;
            // var imageUrl = urlCreator.createObjectURL( blob );
            // project.image_url = imageUrl
            //blobs.push(new Blob([response.data], {type: 'image/jpeg'}))
          })
        )
      })
      $q.all(promises).then(function(){
        $scope.main.projects = projects;
        // console.log('blobs.length', blobs.length)
        // for (var i = 0; i < blobs.length; i++) {
        //   var j = i
        //   var reader = new window.FileReader();
        //   reader.readAsDataURL(blobs[i]);
        //   reader.onloadend = function() {
        //     console.log('result', reader.result)
        //     $scope.main.projects[j].image_url = reader.result;
        //   };
        // }
        $scope.projectsCurrentlyLoading = false;
      });
    });

    $scope.goto_project = function(id) {
      window.location = "#/project/" + id;
    };

    var DialogController = function ($scope, $mdDialog, projectId) {

        $scope.projectId = projectId;

        $scope.closeDialog = function() {
          $mdDialog.hide();
        };

        $scope.deleteProject = function(projectId){
          $mdDialog.show({
            template:
              '<md-dialog aria-label="Dialog">' +
              '  <md-dialog-content>' +
              '    Deleting project' + 
              '  </md-dialog-content>' +
              '</md-dialog>'
          });
          
          var DeleteProject = $resource("/delete/project/" + projectId);
          DeleteProject.save(function(err){
            if(err){
              $scope.errorMessage = "Error: " + err.data
            }
            $route.reload();
            $mdDialog.hide();
          });
        };
    };

    $scope.delete_project = function(id){
      $mdDialog.show({
          template:
            '<md-dialog aria-label="Dialog">' +
            '  <md-dialog-actions>' +
            '    <md-button ng-click="closeDialog()">' +
            '      No' +
            '    </md-button>' +
            '    <md-button ng-click="deleteProject(projectId)">' +
            '      Yes' +
            '    </md-button>' +
            '  </md-dialog-actions>' +
            '  <md-dialog-content>' +
            '    Delete this project?' + 
            '  </md-dialog-content>' +
            '</md-dialog>',
          controller: DialogController,
          locals: {
            projectId: id
          },
      });
    };

    $scope.reorder_projects = function(){
      var resource = $resource('/load/projects/' + $scope.main.sort_criteria);
      resource.query(function(projects){
          $scope.main.projects = projects;
          $route.reload();
      });
    }

  }]);
