angular.module('jobs').controller('organizationController', function($route, $rootScope, $routeParams, $scope, $location, Upload, SweetAlert, organizationService) {
    $scope.org = {};
    $scope.init = function() {
        if ($routeParams.organizationId) {
            //get an existing object
            console.log($routeParams.organizationId)
            organizationService.getOrganizationById($routeParams.organizationId,function(res, err){
                if(!err){
                    if(res.data  &&res.status ===200){
                        $scope.org = res.data;
                    }
                }
            })
        }
    }
    $scope.init();
});