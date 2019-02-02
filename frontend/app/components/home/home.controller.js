angular.module('jobs').controller('homeController', function ($route, $rootScope, $scope, $location, homeService, Upload, SweetAlert) {
    const numberOfitemPerPages = 9;
    $scope.init = function () {
        homeService.getCitiesFilter(b, function (res, err) {
            if (!err) {
                $scope.citiesFilter = res.data;
                // $scope.numberOfPagesInJobsPage = getTotalPages(numberOfitemPerPages, res.data.count);
            }
        });
    }
    $scope.init();

    function getTotalPages(limit, size) {
        return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
    }


    $scope.getJobs = function (pageNumber, q) {
        if (!pageNumber) {
            pageNumber = 1;
        }
        $scope.currentPageNumberInJobsPage = pageNumber;
        var b = {
            pageNumber: pageNumber,
            numberOfitemPerPages: numberOfitemPerPages
        };
        homeService.getJobs(b, function (res, err) {
            if (!err) {
                $scope.jobs = res.data.jobs;
                $scope.numberOfPagesInJobsPage = getTotalPages(numberOfitemPerPages, res.data.count);
            }
        });
    };

    

    $scope.getJobs();
});