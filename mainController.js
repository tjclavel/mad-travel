'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/posts', {
                templateUrl: 'components/project-postings/project-postingsTemplate.html',
                controller: 'ProjectPostingsController'
            }).
            when('/nav', {
                templateUrl: 'components/nav-bar/nav-barTemplate.html',
                controller: 'NavBarController'
            }).
            when('/login', {
                templateUrl: 'components/login/loginTemplate.html',
                controller: 'LoginController'
            }).
            when('/add/project', {
                templateUrl: 'components/project-postings/add-project.html',
                controller: 'ProjectPostingsController'
            }).
            when('/project/:id', {
                templateUrl: 'components/project-view/projectTemplate.html',
                controller: 'ProjectViewController'
            }).
            otherwise({
                redirectTo: '/posts'
            });
    }]);

cs142App.controller('MainController', ['$scope', '$resource',
    function ($scope, $resource) {
        $scope.main = {asAdministrator: false};

        $scope.main.projects = [];

        console.log("from Main");
        console.log($scope.projects);

        $scope.login = function() {
          window.location = "#/login";
        };
    }]);
