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
    }).when('/organization/:organizationId', {
        templateUrl:"./app/components/organization/organization.html",
        controller:'organizationController',
        resolve: {
            deps:['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        "./app/components/organization/organization.service.js",
                        "./app/components/organization/organization.controller.js"
                    ]
                });
            }]
        }
    }).when('/job/:jobId', {
        templateUrl:"./app/components/job/job.single.html",
        controller:'singleJobController',
        resolve: {
            deps:['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: [
                        "./app/components/job/job.service.js",
                        "./app/components/job/job.controller.js"
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
    }).when('/about-us', {
        templateUrl:"./app/components/about_us/aboutUs.html"
    }).when('/privacy', {
        templateUrl:"./app/components/privacy_policy/privacy_policy.html"
    }).when('/terms', {
        templateUrl:"./app/components/terms_of_us/terms.html"
    }).when('/contact', {
        templateUrl:"./app/components/contact_us/contactUs.html",
        controller:"contactController",
        resolve: {
            deps:['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load( {
                    files: [
                        "/app/components/contact_us/contactUs.controller.js",
                        "/app/components/contact_us/contact.service.js"
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




