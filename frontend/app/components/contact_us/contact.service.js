var app = angular.module('jobs');

app.service('contactService' , function ($http, $rootScope) {
    this.sendMail = function(envelop,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "mail",
            data:JSON.stringify(envelop)
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