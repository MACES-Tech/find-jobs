angular.module('jobs').controller('singleJobController', function($route, $rootScope, $routeParams, $scope, $location, Upload, SweetAlert, jobService,$sce) {
    $scope.job = {};
    $scope.init = function() {
        if ($routeParams.jobId) {
            //get an existing object
            jobService.getJobById($routeParams.jobId,function(res, err){
                if(!err){
                    if(res.data  &&res.status ===200){
                        results = res.data;
                        console.log(results);

                        firstRow = results[0];
                        jsonResult = {id:firstRow.id,
                            title : firstRow.title,
                            jobtype:firstRow.jobtype,
                            postedDate: firstRow.postedDate,
                            dueDate: firstRow.dueDate,
                            status: firstRow.status,
                            createdAt: firstRow.createdAt,
                            updatedAt: firstRow.updatedAt,
                            creatorId:firstRow.creatorId,
                            address:firstRow.address,
                            city:{
                                    id:firstRow.cityId,
                                    name:firstRow.cityName,
                                    lat:firstRow.lat,
                                    long: firstRow.long
                                },
                            country:{
                                name:firstRow.countryName
                            },
                            organization:{
                                id:firstRow.organizationId,
                                name:firstRow.organizationName,
                                mainImage:{
                                    path:firstRow.mainImagePath,
                                    altValue: firstRow.mainImageAltvalue
                                }
                            }
                        }
                        jsonResult.tags=[];
                        let tagIds = new Set();

                        jsonResult.sections=[];
                        let secionIds = new Set();

                        let pointIds = new Set();
                        results.forEach((element,index) => {
                            if(element.tagId){
                            tag = {id: element.tagId,
                                name: element.tagName
                            }
                            if(!tagIds.has(tag.id)){
                                tagIds.add(tag.id);
                                jsonResult.tags.push(tag);
                            }
                        }
                            if(element.sectionId){
                            section = {id: element.sectionId,
                                title: element.sectionTitle,
                                description: element.sectionDescription,
                                points:[]
                            }
                            if(!secionIds.has(section.id)){
                                secionIds.add(section.id);
                                jsonResult.sections.push(section);
                            }
                            point={id:element.pointId,
                                title: element.pointTitle
                            }
                            if(!pointIds.has(point.id)){
                                pointIds.add(point.id);
                                jsonResult.sections[jsonResult.sections.length - 1].points.push(point);
                            }
                        }

                        });

                        $scope.job = jsonResult;

                        // mapUrl = "https://maps.google.com/maps?hl=en&amp;coord="+$scope.job.city.lat+","+$scope.job.city.long+"&amp;q=+("+$scope.job.organization.name+")&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"
                        // mapUrl = $sce.trustAsResourceUrl(mapUrl);
                        // document.getElementById("map").src =mapUrl;

                        jobService.getMoreJobsByOrganization( $scope.job.id, $scope.job.organization.id,function(res, err){
                            if(!err){
                                if(res.data  &&res.status ===200){
                                    results = res.data;
                                    $scope.job.organization.jobs = results;
                                }
                            }
                        })
                    }
                }
            })

            
        }
    }
    $scope.init();
});