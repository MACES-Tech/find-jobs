angular.module('jobs').controller('singleJobController', function ($route, $rootScope, $routeParams, $scope, $location, Upload, SweetAlert, jobService, $sce) {
    $scope.job = {};
    $scope.init = function () {
        if ($routeParams.jobId) {
            //get an existing object
            jobService.getJobById($routeParams.jobId, function (res, err) {
                if (!err) {
                    if (res.data && res.status === 200) {
                        results = res.data;

                        firstRow = results[0];
                        jsonResult = {
                            id: firstRow.id,
                            title: firstRow.title,
                            degree: firstRow.degree,
                            postedDate: firstRow.postedDate,
                            dueDate: firstRow.dueDate,
                            status: firstRow.status,
                            createdAt: firstRow.createdAt,
                            updatedAt: firstRow.updatedAt,
                            creatorId: firstRow.creatorId,
                            address: firstRow.address,
                            jobUrl:firstRow.jobUrl,
                            tags: firstRow.tags,
                            city: {
                                id: firstRow.cityId,
                                name: firstRow.cityName,
                                lat: firstRow.lat,
                                long: firstRow.long
                            },
                            country: {
                                name: firstRow.countryName
                            },
                            organization: {
                                id: firstRow.organizationId,
                                name: firstRow.organizationName,
                                mainImage: {
                                    path: firstRow.mainImagePath,
                                    altValue: firstRow.mainImageAltvalue
                                }
                            }
                        }

                        jsonResult.sections = [];
                        let secionIds = new Set();

                        let pointIds = new Set();
                        results.forEach((element, index) => {
                            if (element.sectionId) {
                                section = {
                                    id: element.sectionId,
                                    title: element.sectionTitle,
                                    description: element.sectionDescription,
                                    points: []
                                }
                                if (!secionIds.has(section.id)) {
                                    secionIds.add(section.id);
                                    jsonResult.sections.push(section);
                                }
                                point = {
                                    id: element.pointId,
                                    title: element.pointTitle
                                }
                                if (!pointIds.has(point.id)) {
                                    pointIds.add(point.id);
                                    jsonResult.sections[jsonResult.sections.length - 1].points.push(point);
                                }
                            }

                        });

                        $scope.job = jsonResult;
                        if ($scope.job.dueDate) {
                            setInterval(function () {
                                date_future = new Date($scope.job.dueDate);
                                date_now = new Date();

                                seconds = Math.floor((date_future - (date_now)) / 1000);
                                minutes = Math.floor(seconds / 60);
                                hours = Math.floor(minutes / 60);
                                days = Math.floor(hours / 24);

                                hours = hours - (days * 24);
                                minutes = minutes - (days * 24 * 60) - (hours * 60);
                                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                                $("#time").text(" Application ends in " + days + "d " + hours + "h " + minutes + "m " + seconds + "s");
                            }, 1000);
                        }

                        jobService.getMoreJobsByOrganization($scope.job.id, $scope.job.organization.id, function (res, err) {
                            if (!err) {
                                if (res.data && res.status === 200) {
                                    results = res.data;
                                    $scope.job.organization.jobs = results;
                                    
                                    if( $scope.job.city)
                                        $scope.reloadScripts();
                                }
                            }
                        })
                        tagsString = "";
                        $scope.job.tags.forEach(element => {
                            tagsString+="tag="+element.tagId +"&";
                        });
                        jobService.getJobsBytags(tagsString, function (res, err) {
                            if (!err) {
                                if (res.data && res.status === 200) {
                                    results = res.data;
                                    $scope.relatedJobs = results;
                                }
                            }
                        })
                    }
                }
            })


        }
    }
    $scope.reloadScripts = function () {
        var script = document.createElement('script');
        script.src = "assets/js/initMap.js";
        document.head.appendChild(script);
    }
    $scope.init();
});