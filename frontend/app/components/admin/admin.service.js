var app = angular.module('jobs');

app.service('adminService', function ($http, $rootScope) {
    var self = this;

    self.creatNewOrganization = function(org,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "organization",
            data:JSON.stringify(org)
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
    self.getOrganizations = function(pageNumber,itemsPerPage,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "organization?pageNumber="+pageNumber+"&itemsPerPage="+itemsPerPage
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };

    self.getCountries = function(cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "country"
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
    self.getCities = function(country,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "country/"+country.id +"/city"
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
    
    self.getAllTags = function(cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "tag",
            cash: true
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
    self.createJobPost = function(job,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "job",
            data:JSON.stringify(job)
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };

    self.getJobs = function(pageNumber,itemsPerPage,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "job?pageNumber="+pageNumber+"&itemsPerPage="+itemsPerPage
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };


})