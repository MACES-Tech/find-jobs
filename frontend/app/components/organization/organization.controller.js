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
                        $scope.weburi = $location.absUrl();
                        $scope.myhostname = $location.host();
                        $scope.webportno = $location.port();
                        $scope.webprotocol = $location.protocol();
                        
                        $scope.reloadScripts ();
                        // $scope.org.mapUrl ="https://www.google.com/maps/embed?center="+$scope.org.city.lat+','+$scope.org.city.long+"&zoom=14";
                        // $scope.org.mapUrl = $sce.trustAsResourceUrl($scope.org.mapUrl);
                    }
                }
            })
        }
    }
    $scope.reloadScripts = function(){
        var script = document.createElement('script');
        script.src = "assets/js/initMap.js";
        document.head.appendChild(script);
    }
    $scope.init();
});