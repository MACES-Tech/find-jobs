var app = angular.module('jobs');

app.service('organizationService', function ($http, $rootScope) {
    var self = this;
    self.getOrganizationById = function (orgId, cb) {
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "organization/"+orgId
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