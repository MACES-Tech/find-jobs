'use strict';
var app = angular.module('jobs');


function footerImp () {
    return {
        templateUrl: './app/components/footer/footer.html',
        controller: 'footerController'
    };
}

app.directive('footerPanel', footerImp);
