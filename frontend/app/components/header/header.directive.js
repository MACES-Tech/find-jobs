'use strict';
var app = angular.module('jobs');


function headerImp () {
    return {
        templateUrl: './app/components/header/header.html',
        controller: 'headerController'
    };
}

app.directive('headerPanel', headerImp);
