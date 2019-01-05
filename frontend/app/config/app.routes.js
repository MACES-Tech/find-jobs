angular.module('jobs').config(function ($routeProvider, $ocLazyLoadProvider) {

    $routeProvider.when('/home', {
        templateUrl:"./app/components/home/home.html",
        controller:'homeController',
        resolve: {
            deps:['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        "./app/components/home/home.service.js",
                        "./app/components/home/home.controller.js"
                    ]
                });
            }]
        }
    }).when('/admin/home', {
        templateUrl:"./app/components/admin/home/admin.home.html",
        controller:'adminController',
        resolve: {
            deps:['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        "./app/components/admin/admin.service.js",
                        "./app/components/admin/home/admin.controller.js"
                    ]
                });
            }]
        }
    }).otherwise({
        templateUrl:"./app/components/home/home.html", 
        controller:'homeController', 
        resolve: {
            deps:['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load( {
                    files: [
                        "./app/components/home/home.service.js",
                        "./app/components/home/home.controller.js"
                    ]
                });
            }]
        }
    });
});




