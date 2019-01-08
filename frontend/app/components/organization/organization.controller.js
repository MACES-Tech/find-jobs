angular.module('jobs').controller('organizationController', function($route, $rootScope,$sce, $routeParams, $scope, $location, Upload, SweetAlert, organizationService) {
    $scope.org = {};
    $scope.init = function() {
        if ($routeParams.organizationId) {
            //get an existing object
            console.log($routeParams.organizationId)
            organizationService.getOrganizationById($routeParams.organizationId,function(res, err){
                if(!err){
                    if(res.data  &&res.status ===200){
                        $scope.org = res.data;
                        $scope.org.mapUrl ="https://www.google.com/maps/embed?center="+$scope.org.city.lat+','+$scope.org.city.long+"&zoom=14";
                        $scope.org.mapUrl = $sce.trustAsResourceUrl($scope.org.mapUrl);
                    }
                }
            })
        }
    }
    $scope.init();
});