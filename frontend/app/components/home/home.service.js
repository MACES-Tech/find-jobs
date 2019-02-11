var app = angular.module('jobs');

app.service('homeService', function ($http, $rootScope) {
    var self = this;
    self.getJobs = function(body,cb){
        var url = $rootScope.backendURL + "job/filter";
        $http({
            method: 'POST',
            url: url,
            data: JSON.stringify(body)
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

        self.getGradesFilter = function(cb){
            var url = $rootScope.backendURL + "degree";
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