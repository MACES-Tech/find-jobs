var app = angular.module('jobs');

app.service('jobService', function ($http, $rootScope) {
    var self = this;
    self.getJobById = function (jobId, cb) {
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "job/"+jobId
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