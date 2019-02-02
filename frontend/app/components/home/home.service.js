var app = angular.module('jobs');

app.service('homeService', function ($http, $rootScope) {
    var self = this;
    self.getJobs = function(body,cb){
        var url = $rootScope.backendURL + "job/filter";
        $http({
            method: 'POST',
            url: url,
            body: body
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

    self.getCitiesFilter = function(body,cb){
        var url = $rootScope.backendURL + "city/filter";
        $http({
            method: 'GET',
            url: url
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
});