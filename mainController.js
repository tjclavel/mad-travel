'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/posts', {
                templateUrl: 'components/project-postings/project-postingsTemplate.html',
                controller: 'ProjectPostingsController'
            }).
            when('/login', {
                templateUrl: 'components/login/loginTemplate.html',
                controller: 'LoginController'
            }).
            when('/add/project', {
                templateUrl: 'components/project-add/project-addTemplate.html',
                controller: 'ProjectAddController'
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
        $scope.main = {asAdministrator: false, sort_criteria: "earliest_start_date_first"};

        $scope.login = function() {
            window.location = "#/login";
        };

        $scope.projectsViewCurrentlyDisplayed = function() {
            return $scope.main.currentView === "projectsView"
        }
    }]);
