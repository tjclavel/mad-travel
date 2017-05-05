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

        $scope.curId = 3;
        $scope.projects = [{title: "doggo", image: "/images/doge.jpeg", id: 1},
                            {title: "doge2", image: "/images/doge.jpeg", id: 2}];
    }]);
