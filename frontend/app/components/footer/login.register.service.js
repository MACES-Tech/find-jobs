var app = angular.module('jobs');

app.service('loginRegisterService' , function ($http, $rootScope) {
    this.login = function(loginObject,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "login",
            data:JSON.stringify(loginObject)
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
    this.register = function(registerObject,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "register",
            data:JSON.stringify(registerObject)
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

});