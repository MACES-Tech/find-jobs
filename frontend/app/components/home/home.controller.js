angular.module('jobs').controller('homeController', function ($route, $rootScope, $scope, $location, homeService, Upload, SweetAlert) {

    $scope.numberOfitemPerPages = 9;
    $scope.selectedGradeFilter = {
        id: -1,
        name: "All Job Grades"
    };
    $scope.selectedDutyStation = {
        id: -1,
        name: ""
    };
    $scope.selectedJobTitle = {
        id: -1,
        title: ""
    };
    $scope.selectedTags = [];
    $scope.selectedOrgs = [];
    $scope.init = function () {
        homeService.getGradesFilter(function (res, err) {
            if (!err) {
                $scope.gradesFilter = [$scope.selectedGradeFilter];
                $scope.gradesFilter = $scope.gradesFilter.concat(res.data);

            }
        });
    }
    $scope.init();

    function getTotalPages(limit, size) {
        return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
    }


    $scope.getJobs = function (pageNumber, q) {
        debugger;
        if (!pageNumber) {
            pageNumber = 1;
        }

        if ($scope.selectedDutyStation.name == "") {
            $scope.selectedDutyStation.id = -1;
        }

        $scope.currentPageNumberInJobsPage = pageNumber;
        var b = {
            pageNumber: pageNumber,
            numberOfitemPerPages: $scope.numberOfitemPerPages,
            job_title: $scope.selectedJobTitle.title,
        };
        if ($scope.selectedGradeFilter.id != -1) {
            b.grade = $scope.selectedGradeFilter.id;
        }
        if ($scope.selectedDutyStation.id != -1) {
            b.city = $scope.selectedDutyStation.id;
        }
        if($scope.selectedTags.length > 0){
            b.tags = $scope.selectedTags.map(function(tag){
                return tag.id;
            });
        }
        if($scope.selectedOrgs.length > 0){
            b.organizations = $scope.selectedOrgs.map(function(org){
                return org.id;
            });
        }
        homeService.getJobs(b, function (res, err) {
            if (!err) {
                $scope.jobs = res.data.jobs;
                $scope.jobsCount = res.data.count;
                $scope.numberOfPagesInJobsPage = getTotalPages($scope.numberOfitemPerPages, res.data.count);
                $scope.startIndexOfJobs = (($scope.currentPageNumberInJobsPage - 1) * $scope.numberOfitemPerPages) + 1;
                $scope.endIndexOfJobs = Math.min((($scope.currentPageNumberInJobsPage - 1) * $scope.numberOfitemPerPages) + $scope.numberOfitemPerPages, $scope.jobsCount);
            }
        });
    };

    /**
     * Typeahead.js configuration
     */
    $(document).ready(function () {

        var cityAutoComplete = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            remote: {
                url: $rootScope.backendURL + 'city/filter?q=%QUERY',
                wildcard: '%QUERY'
            }
        });

        $('.city_typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        }, {
            name: 'Cities',
            display: 'name',
            source: cityAutoComplete,
        }).bind('typeahead:select', function (ev, suggestion) {
            $scope.selectedDutyStation = suggestion;
            $scope.getJobs();
        });

        var jobTitleAutoComplete = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            remote: {
                url: $rootScope.backendURL + 'typeahead/job?q=%QUERY',
                wildcard: '%QUERY'
            }
        });

        $('.jobTitle_typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        }, {
            name: 'Jobs',
            display: 'title',
            source: jobTitleAutoComplete,
        }).bind('typeahead:select', function (ev, suggestion) {
            $scope.selectedJobTitle = suggestion;
            $scope.getJobs();
        });

        var tagAutoComplete = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            remote: {
                url: $rootScope.backendURL + 'typeahead/tag?q=%QUERY',
                wildcard: '%QUERY'
            }
        });

        $('.tag_typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        }, {
            name: 'Tags',
            display: 'name',
            source: tagAutoComplete,
        }).bind('typeahead:select', function (ev, suggestion) {
            $scope.selectedTags.push(suggestion);
            $scope.getJobs();
        });

        var orgAutoComplete = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            remote: {
                url: $rootScope.backendURL + 'typeahead/organization?q=%QUERY',
                wildcard: '%QUERY'
            }
        });

        $('.org_typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        }, {
            name: 'Organizations',
            display: 'name',
            source: orgAutoComplete,
        }).bind('typeahead:select', function (ev, suggestion) {
            $scope.selectedOrgs.push(suggestion);
            $scope.getJobs();
        });

    });

    $scope.ignoreTag = function (tag) {
        var index = $scope.selectedTags.indexOf(tag);
        if (index > -1) {
            $scope.selectedTags.splice(index, 1);
        }
        $scope.getJobs();
    }

    $scope.ignoreOrganization = function (org) {
        var index = $scope.selectedOrgs.indexOf(org);
        if (index > -1) {
            $scope.selectedOrgs.splice(index, 1);
        }
        $scope.getJobs();
    }

    $scope.getJobs();
});