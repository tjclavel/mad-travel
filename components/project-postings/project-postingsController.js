cs142App.controller('ProjectPostingsController', ['$scope', '$resource', '$location', '$mdDialog', '$route',
  function($scope, $resource, $location, $mdDialog, $route) {

    $scope.addProject = function() {
      $location.path("/add/project");
    };

    var resource = $resource('/load/projects/' + $scope.main.sort_criteria);
    resource.query(function(projects){
      $scope.main.projects = projects;
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
          console.log(projectId);
          var DeleteProject = $resource("/delete/project/" + projectId);
          DeleteProject.save(function(){
            console.log("Project deleted");
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
