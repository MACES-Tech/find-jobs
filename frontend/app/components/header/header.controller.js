angular.module('jobs')
    .controller('headerController', function ($rootScope, $scope, $location) {

        $rootScope.$on('$routeChangeStart', function (next, last) {
            if($('.preloader').length){
                $('.preloader').delay(2).fadeOut(500);
            }
         });

});