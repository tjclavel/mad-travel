
cs142App.controller('JobPostingsController', ['$scope',
  function($scope) {
    
  	$scope.addPost = function() {
  		window.location.href = "#/add/post";
  	};

  	// $scope.adding = function() {
  	// 	console.log("hello");
  	// 	console.log($scope.job);
  	// };

  }]);
