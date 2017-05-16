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
        $scope.main = {};

        $scope.curId = 4;
        $scope.projects = [{title: "doggo", image: "/images/doge.jpeg", id: 1},
                           {title: "doggo treat", image: "/images/dog-treat.jpg", id: 2},
                            {title: "gross furball thing", image: "/images/cat.jpg", id: 3}];

        $scope.asAdministrator = false;
    }]);
