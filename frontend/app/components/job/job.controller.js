angular.module('jobs').controller('singleJobController', function($route, $rootScope, $routeParams, $scope, $location, Upload, SweetAlert, jobService) {
    $scope.org = {};
    $scope.init = function() {
        if ($routeParams.jobId) {
            //get an existing object
            jobService.getJobById($routeParams.jobId,function(res, err){
                if(!err){
                    if(res.data  &&res.status ===200){
                        $scope.job = res.data;
                        console.log($scope.job);
                        
                    }
                }
            })
        }
    }
    $scope.init();
});