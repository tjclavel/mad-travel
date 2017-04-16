'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/posts', {
                templateUrl: 'components/job-postings/job-postingsTemplate.html',
                controller: 'JobPostingsController'
            }).
            when('/nav', {
                templateUrl: 'components/nav-bar/nav-barTemplate.html',
                controller: 'NavBarController'
            }).
            otherwise({
                redirectTo: '/posts'
            });
    }]);

cs142App.controller('MainController', ['$scope', '$resource',
    function ($scope, $resource) {
        $scope.main = {};
    }]);
