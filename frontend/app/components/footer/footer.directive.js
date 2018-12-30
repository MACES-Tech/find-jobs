'use strict';
var app = angular.module('buildingChain');


function footerImp () {
    return {
        templateUrl: './app/components/footer/footer.html',
        controller: 'footerController'
    };
}

app.directive('footerPanel', footerImp);
