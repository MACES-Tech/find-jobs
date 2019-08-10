angular.module('jobs').controller('homeController', function ($route, $rootScope, $scope, $location, homeService, Upload, SweetAlert) {

    $scope.numberOfitemPerPages = 20;
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
    $scope.selectedOrg = {
        id: -1,
        name: ""
    };
    $scope.selectedTags = [];
    $scope.selectedOrgs = [];
    $scope.closingSoon = false;
    $scope.closed = false;
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


    $scope.preparePagination = function(){
        var maxSize = 10;
        startPage = Math.max($scope.currentPageNumberInJobsPage - Math.floor(maxSize / 2), 1);
        endPage = startPage + maxSize - 1;

        // Adjust if limit is exceeded
        if (endPage > $scope.numberOfPagesInJobsPage) {
          endPage = $scope.numberOfPagesInJobsPage;
          startPage = Math.max(endPage - maxSize + 1, 1);
        }
        var ret = [];
        for(var i = startPage; i <= endPage; i++){
            ret.push(i);
        }
        return ret;
    };

    $scope.getJobs = function (pageNumber, q) {
        if (!pageNumber) {
            pageNumber = 1;
        }

        if ($scope.selectedDutyStation.name == "") {
            $scope.selectedDutyStation.id = -1;
        }
        if ($scope.selectedOrg.name == "") {
            $scope.selectedOrg.id = -1;
        }

        $scope.currentPageNumberInJobsPage = pageNumber;
        var b = {
            pageNumber: pageNumber,
            numberOfitemPerPages: $scope.numberOfitemPerPages,
            job_title: $scope.selectedJobTitle.title,
            closing_soon: $scope.closingSoon,
            closed: $scope.closed
        };
        if ($scope.selectedGradeFilter.id != -1) {
            b.grade = $scope.selectedGradeFilter.id;
        }
        if ($scope.selectedDutyStation.id != -1) {
            b.city = $scope.selectedDutyStation.id;
        }
        if ($scope.selectedOrg.id != -1) {
            b.organizations = [$scope.selectedOrg.id];
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
                $scope.jobs = [];
                $scope.jobs.push({type:"ads"})
                 res.data.jobs.forEach(element =>{
                    $scope.jobs.push(element);
                 });
                $scope.jobs.push({type:"ads"})
                $scope.jobsCount = res.data.count;
                row =  [];
                $scope.rows =  [];
                $scope.jobs.forEach((element,index) => {
                    var jobPostedDate = new Date(element.createdAt);
                    // $scope.yourDate = new Date('2015-07-08T14:02:42.973');
                    element.DateDifference = moment(jobPostedDate).fromNow();
                    row.push(element);
                    if((index+1) % 3 ==0){
                        $scope.rows.push(row);
                        row =  [];
                    }else if(index == $scope.jobs.length - 1){
                        $scope.rows.push(row);
                    }
                });
                console.log($scope.rows);
                
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
            $scope.selectedOrg = suggestion;
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