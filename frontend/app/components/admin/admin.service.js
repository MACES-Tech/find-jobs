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

    self.getTags = function(pageNumber,itemsPerPage,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "tag?pageNumber="+pageNumber+"&itemsPerPage="+itemsPerPage
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

    self.deleteTag = function(tagId,cb){
        $http({
            method: 'DELETE',
            url: $rootScope.backendURL + "tag/" + tagId
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
            });
    };

    self.updateTag = function(tag,cb){
        $http({
            method: 'PUT',
            url: $rootScope.backendURL + "tag/" + tag.id,
            data:JSON.stringify(tag)
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
            });
    };

    self.addNewTag = function(tag,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "tag",
            data:JSON.stringify(tag)
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
            });
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
})