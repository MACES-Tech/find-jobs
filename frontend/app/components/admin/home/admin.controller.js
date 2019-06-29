angular.module('jobs')
    .controller('adminController', function ($rootScope, $scope, $location, $route, adminService, Upload, SweetAlert,$window ) {

        $scope.pages = [
            {
                title: "Manage Organizations",
                html: "./app/components/admin/page-content/organization-page.html",
                icon: "careerfy-business",
                url: "organizations",
                showInList: true,
                function: getManageOrgainzationPage,
                authority: ['SUPER_ADMIN', 'ADMIN']
            },
            {
                title: "New organization",
                html: "./app/components/admin/page-content/new-Organization.html",
                url: "new_organization",
                icon: "careerfy-plus",
                showInList: true,
                function: getNewOrgainzationPage,
                authority: ['SUPER_ADMIN', 'ADMIN']
            }, {
                title: "Edit organization",
                html: "./app/components/admin/page-content/new-Organization.html",
                url: "edit_organization",
                icon: "careerfy-plus",
                showInList: false,
                function: getEditOrgainzationPage,
                authority: ['SUPER_ADMIN']
            },
            {
                title: "Manage Jobs",
                html: "./app/components/admin/page-content/manage-jobs.html",
                icon: "careerfy-briefcase-1",
                url: "jobs",
                showInList: true,
                function: getManageJobsPage,
                authority: ['SUPER_ADMIN', 'ADMIN']
            },
            {
                title: "Manage Degrees",
                html: "./app/components/admin/page-content/manage-degrees.html",
                icon: "careerfy-briefcase-1",
                url: "degree",
                showInList: false,
                function: getManageDegreesPage,
                authority: ['SUPER_ADMIN', 'ADMIN']
            },
            {
                title: "Tags",
                html: "./app/components/admin/page-content/manage-tags.html",
                icon: "careerfy-salary",
                url: "tags",
                showInList: true,
                function: getManageTagsPage,
                authority: ['SUPER_ADMIN', 'ADMIN']
            }, {
                title: "Admins",
                html: "./app/components/admin/page-content/manage-admins.html",
                icon: "careerfy-group",
                url: "admins",
                showInList: true,
                authority: ['SUPER_ADMIN'],
                function: getManageAdminsPage
            }, {
                title: "Post a New Job",
                html: "./app/components/admin/page-content/new-job.html",
                icon: "careerfy-plus",
                url: "new_job",
                showInList: true,
                function: getNewJobPage,
                authority: ['SUPER_ADMIN', 'ADMIN']
            },{
                title: "Edit Job",
                html: "./app/components/admin/page-content/new-job.html",
                icon: "careerfy-plus",
                url: "edit_job",
                showInList: false,
                function: getEditJobPage,
                authority: ['SUPER_ADMIN', 'ADMIN']
            }, {
                title: "Subscriptions List",
                html: "./app/components/admin/page-content/subscriptions-list.html",
                icon: "careerfy-alarm",
                url: "subscription_list",
                showInList: true,
                authority: ['SUPER_ADMIN'],
                function: getSubscriptionListPage
            },
            {
                title: "Change password",
                html: "./app/components/admin/page-content/change-password.html",
                icon: "careerfy-multimedia",
                url: "change_password",
                showInList: true,
                authority: ['SUPER_ADMIN', 'ADMIN']
            }
        ]
        $scope.notFoundPage = {
            title: "Not found",
            html: "./app/components/admin/page-content/not-found.html",
            url: "not_found",
            authority: ['SUPER_ADMIN', 'ADMIN']
        }
        const numberOfitemPerPages = 9;
        // $scope.org={name:"Enter Name",industry:"Banking",hotLine:"19600",email:"dum72@gmail.com","webSite":" http://themeforest.net"}
        $scope.opnePage = function (pageUrl,query) {
            if(!query){
                query = {};
            }
            query.page = pageUrl;
            $location.path('/admin/home', false).search(query);
            setCurrentPage(($location.search()).page);

        }
        $scope.hasAuthorityToViewPage = function (page) {
            const userRole = $rootScope.getcurrentUser().role;
            if (page.authority.indexOf(userRole) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        $scope.init = function () {
            if (!$rootScope.isAdmin()) {
                $rootScope.goTopage("/");
                return;
            }
            if (!($location.search()).page) {
                // $scope.opnePage($scope.pages[0].url);
                if ($rootScope.getcurrentUser().role === 'SUPER_ADMIN')
                    $location.path('/admin/home', false).search({ page: $scope.pages[0].url });
                else {
                    $location.path('/admin/home', false).search({ page: $scope.pages[5].url });
                }
            } else {
                $location.path('/admin/home', false).search($location.search());
            }
            setCurrentPage(($location.search()).page)
        }
        function setCurrentPage(pageUrl) {

            $scope.currentPage = undefined;
            $scope.pages.forEach(element => {
                if (element.url === pageUrl) {
                    $scope.currentPage = element
                    return;
                }
            });
            if (!$scope.currentPage) {
                $scope.currentPage = $scope.notFoundPage;
            }
            if ($scope.currentPage && $scope.hasAuthorityToViewPage($scope.currentPage))
                getPageContent($scope.currentPage)
            else {
                $scope.currentPage = $scope.notFoundPage;
                getPageContent($scope.currentPage)
            }

        }

        function getPageContent(page) {
            if (page.function)
                page.function();
        }

        $scope.getManageOrgainzationPage = function (pageNumber) {
            getManageOrgainzationPage(pageNumber);
        }

        // $scope.orgSearchQuery = ""
        $scope.filterOrganizations = function (orgSearchQuery) {
            getManageOrgainzationPage(0, orgSearchQuery);
        }

        function getManageOrgainzationPage(pageNumber, q) {
            if (!pageNumber) {
                pageNumber = 1;
            }
            $scope.currentPageNumberInOrganizationPage = pageNumber;
            if ($rootScope.getcurrentUser().role == "ADMIN")
                adminId = $rootScope.getcurrentUser().id
            adminService.getOrganizations(pageNumber, numberOfitemPerPages, q, function (res, err) {
                $scope.organizations = res.data;

                $scope.numberOfPagesInOrganizationPage = res.data[0] ? getTotalPages(numberOfitemPerPages, res.data[0].organizationsCount) : 0;
            })
        }

        /*
        *   Tags Section
        */
        $scope.newTag = {};
        $scope.getManageTagsPage = function (pageNumber) {
            getManageTagsPage(pageNumber);
        };

        $scope.filterTags = function (tagSearchQuery) {
            getManageTagsPage(0, tagSearchQuery);
        }

        function getManageTagsPage(pageNumber, q) {
            if (!pageNumber) {
                pageNumber = 1;
            }
            $scope.currentPageNumberInTagsPage = pageNumber;
            adminService.getTags(pageNumber, numberOfitemPerPages, q, function (res, err) {
                $scope.tags = res.data;
                $scope.numberOfPagesInTagsPage = getTotalPages(numberOfitemPerPages, res.data[0].tagsCount);
            });
        }

        $scope.deleteTag = function (tag) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "You will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        adminService.deleteTag(tag.id, function (res, err) {
                            if (!err) {
                                var index = $scope.tags.indexOf(tag);
                                $scope.tags.splice(index, 1);
                                SweetAlert.swal("Done", "Tag deleted successfully", "success");
                            } else {
                                SweetAlert.swal("Error", "an error occuers", "error");
                            }
                        });
                    } else {
                        SweetAlert.swal("Cancelled", "Your data is safe :)", "error");
                    }
                });
        };

        $scope.updateTagKeyPressed = function (tag, $event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                // Do that thing you finally wanted to do
                $scope.updateTag(tag);
            }
        };

        $scope.updateTag = function (tag) {
            if (!tag.editMode) {
                tag.editMode = !tag.editMode;
                return;
            }
            tag.editMode = !tag.editMode;
            adminService.updateTag(tag, function (res, err) {
                if (err) {
                    SweetAlert.swal("Error", "an error occuers", "error");
                } else {
                    SweetAlert.swal("Done", "", "success");
                }
            });
        };

        $scope.addNewTag = function () {
            adminService.addNewTag($scope.newTag, function (res, err) {
                if (err) {
                    SweetAlert.swal("Error", "an error occuers", "error");
                } else {
                    $scope.newTag = {};
                    tag = res.data;
                    tag.jobCount = 0;
                    $scope.tags.splice(0, 0, tag);
                    // $scope.tags.push(0, res.data);
                    SweetAlert.swal("Done", "", "success");
                }
            });
        };


        /*
        *   Admins Section
        */
        $scope.newAdmin = {};
        $scope.getManageAdminsPage = function (pageNumber) {
            getManageAdminsPage(pageNumber);
        };

        $scope.filterAdmins = function (adminSearchQuery) {
            getManageAdminsPage(0, adminSearchQuery);
        }
        function getSubscriptionListPage(pageNumber){
            if (!pageNumber) {
                pageNumber = 1;
            }
            $scope.currentPageNumberInSubscriptionListPage = pageNumber;
            adminService.getSubscriptionList(pageNumber, numberOfitemPerPages, function (res, err) {
                $scope.subscriptions = res.data.subscriptions;
                $scope.numberOfPagesInSubscriptionListPage = getTotalPages(numberOfitemPerPages, res.data.count);
            });
        }
        function getManageAdminsPage(pageNumber, q) {
            if (!pageNumber) {
                pageNumber = 1;
            }
            $scope.currentPageNumberInAdminsPage = pageNumber;
            adminService.getAdmins(pageNumber, numberOfitemPerPages, q, function (res, err) {
                $scope.admins = res.data.users;
                $scope.numberOfPagesInAdminsPage = getTotalPages(numberOfitemPerPages, res.data.count);
            });
        }

        $scope.deleteAdmin = function (admin) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "You will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        adminService.deleteAdmin(admin.id, function (res, err) {
                            if (!err) {
                                var index = $scope.admins.indexOf(admin);
                                $scope.admins.splice(index, 1);
                                SweetAlert.swal("Done", "Admin deleted successfully", "success");
                            } else {
                                SweetAlert.swal("Error", "an error occuers", "error");
                            }
                        });
                    } else {
                        SweetAlert.swal("Cancelled", "Your data is safe :)", "error");
                    }
                });
        };

        $scope.updateAdminKeyPressed = function (admin, $event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                // Do that thing you finally wanted to do
                $scope.updateAdmin(admin);
            }
        };

        $scope.updateAdmin = function (admin) {
            if (!admin.editMode) {
                admin.editMode = !admin.editMode;
                return;
            }
            admin.editMode = !admin.editMode;
            adminService.updateAdmin(admin, function (res, err) {
                if (err) {
                    SweetAlert.swal("Error", "an error occuers", "error");
                } else {
                    SweetAlert.swal("Done", "", "success");
                }
            });
        };

        $scope.addNewAdmin = function () {
            $scope.newAdmin.role = "ADMIN";
            adminService.addNewAdmin($scope.newAdmin, function (res, err) {
                if (err) {
                    SweetAlert.swal("Error", "an error occuers", "error");
                } else {
                    if(res.status == 400){
                        SweetAlert.swal("Error",res.data.message, "error");
                    }else{
                    $scope.newAdmin = {};
                    $scope.admins.splice(0, 0, res.data.user);
                    SweetAlert.swal("Done", "", "success");
                }
                }
            });
        };


        $scope.getManageJobsPage = function (pageNumber) {
            getManageJobsPage(pageNumber)
        }

        $scope.filterJobs = function (jobSearchQuery) {
            getManageJobsPage(0, jobSearchQuery);
        }

        function getManageDegreesPage(pageNumber){
            if (!pageNumber) {
                pageNumber = 1;
            }
        }
        function getManageJobsPage(pageNumber, q) {
            if (!pageNumber) {
                pageNumber = 1;
            }
            $scope.currentPageNumberInJobsPage = pageNumber;
            adminId = "";
            if ($rootScope.getcurrentUser().role == "ADMIN")
                adminId = $rootScope.getcurrentUser().id
            adminService.getJobs(pageNumber, numberOfitemPerPages, q, function (res, err) {
                if (!err) {
                    $scope.jobs = res.data.jobs;
                    $scope.numberOfPagesInJobsPage = getTotalPages(numberOfitemPerPages, res.data.count);
                }
            }, adminId)
        }
        $scope.approvejobPost = function (jobId, index) {
            updatedObject = { id: jobId }
            adminService.approveJobPost(updatedObject, function (res, err) {
                if (!err) {
                    $scope.jobs[index].status = 'Active'
                    SweetAlert.swal("Good job!", "The Job Approved successfully", "success");
                } else {
                    SweetAlert.swal("Error", "an error occuers", "error");
                }
            })
        }

        $scope.approveorganization = function (orgId, index) {
            updatedObject = { approvedByAdmin: "1" }
            adminService.updateOrganization(orgId, updatedObject, function (res, err) {
                if (!err) {
                    $scope.organizations[index].approvedByAdmin = '1'
                    SweetAlert.swal("Good job!", "The organization Approved successfully", "success");
                } else {
                    SweetAlert.swal("Error", "an error occuers", "error");
                }
            })
        }
        $scope.deleteJobPost = function (jobId, index) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $scope.deleteIt(jobId, index)
                    } else {
                        SweetAlert.swal("Cancelled", "Your data is safe :)", "error");
                    }
                });
        }
        $scope.deleteIt = function (jobId, index) {
            adminService.deleteJobPost(jobId, function (res, err) {
                if (!err) {
                    $scope.jobs.splice(index, 1);
                    SweetAlert.swal("Deleted!", "Your data has been deleted.", "success");
                }
            })
        }
        $scope.deleteOrganization = function (orgId, index) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $scope.deleteOrg(orgId, index)
                    } else {
                        SweetAlert.swal("Cancelled", "Your data is safe :)", "error");
                    }
                });
        }
        $scope.deleteOrg = function (orgId, index) {
            adminService.deleteOrganization(orgId, function (res, err) {
                if (!err) {
                    $scope.organizations.splice(index, 1);
                    SweetAlert.swal("Deleted!", "Your data has been deleted.", "success");
                }
            })
        }

        $scope.org = {}
        $scope.job = {};
        $scope.job.sections = [];
        $scope.loadTags = function ($query) {
            return $scope.AllTags.filter(function (tag) {
                return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
        };
        $scope.loadOrganizations = function ($query) {
            return $scope.AllOrganizations.filter(function (org) {
                return org.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
        };
        $scope.editOrganization = function (orgId) {
            $scope.opnePage('edit_organization',{orgId:orgId});
        }
        function getNewOrgainzationPage() {
            adminService.getCountries(function (res, err) {
                if (!err) {
                    $scope.countries = res.data;
                }
            })
        }

        function getEditOrgainzationPage() {
            if ($location.search().orgId) {
                adminService.getOrganizationById($location.search().orgId, function (res, err) {
                    if (!err && res.data.id) {
                        $scope.org = res.data;
                        // if(res.data.city != null){
                            // $scope.org.selectedCity = JSON.stringify(res.data.city);
                        // }
                        adminService.getCountries(function (res, err) {
                            if (!err) {
                                $scope.countries = res.data;
                                $scope.countries.forEach(country => {
                                    if (country.id == $scope.org.city.countryId) {
                                        $scope.selectedCountry = JSON.stringify(country);
                                        $scope.getCities($scope.selectedCountry, $scope.org.city);
                                    }
                                });
                            }
                        });
                    } else {
                        $scope.opnePage('new_organization');
                    }
                })
            }else{
                $scope.opnePage('new_organization');
            }
        }

        function getNewJobPage() {
            adminService.getCountries(function (res, err) {
                if (!err) {
                    $scope.countries = res.data;
                }
            })
            adminService.getAllTags(function (res, err) {
                $scope.AllTags = res.data;
            })
            adminService.getOrganizationsNames(function (res, err) {
                $scope.AllOrganizations = res.data;
            })
            adminService.getdegrees(function (res, err) {
                $scope.degrees = res.data;
            })
            var section = { title: "", description: "", points: [{ title: "" }] };
            $scope.job.sections.push(section)
        }
        $scope.editJob = function (jobId) {
            $scope.opnePage('edit_job',{jobId:jobId});
        }
        function getEditJobPage() {
            if ($location.search().jobId) {
                adminService.getJobById($location.search().jobId,function(res,err){
                    if (!err && res.data[0].id) {
                        results = res.data;

                        firstRow = results[0];
                        jsonResult = {id:firstRow.id,
                            title : firstRow.title,
                            postedDate: new Date(firstRow.postedDate),
                            expiredDate: new Date(firstRow.dueDate),
                            status: firstRow.status,
                            createdAt: firstRow.createdAt,
                            updatedAt: firstRow.updatedAt,
                            creatorId:firstRow.creatorId,
                            address:firstRow.address,
                            jobUrl:firstRow.jobUrl,
                            city:{
                                    id:firstRow.cityId,
                                    name:firstRow.cityName,
                                    lat:firstRow.lat,
                                    long: firstRow.long
                                },
                            country:{
                                name:firstRow.countryName
                            }
                        }
                        if(firstRow.degreeId != null){
                            jsonResult.degree = firstRow.degreeId.toString();
                        }
                        if(firstRow.organizationId != null){
                            jsonResult.organization = [{
                                id:firstRow.organizationId,
                                name:firstRow.organizationName
                            }];
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

                       
                        adminService.getCountries(function (res, err) {
                            if (!err) {
                                $scope.countries = res.data;
                                $scope.countries.forEach(country => {
                                    if (country.name == $scope.job.country.name) {
                                        $scope.selectedCountry = JSON.stringify(country);
                                        $scope.getCities($scope.selectedCountry, $scope.job.city)
                                    }
                                });
                            }
                        })
                        // adminService.getAllTags(function (res, err) {
                        //     $scope.AllTags = res.data;
                        // })
                        adminService.getOrganizationsNames(function (res, err) {
                            $scope.AllOrganizations = res.data;
                        })
                        adminService.getAllTags(function (res, err) {
                            $scope.AllTags = res.data;
                        })
                        adminService.getdegrees(function (res, err) {
                            $scope.degrees = res.data;
                        })
                    }else{
                        $scope.opnePage('new_job');
                    }
                })
                
                // var section = { title: "", description: "", points: [{ title: "" }] };
                // $scope.job.sections.push(section)


            }else{
                $scope.opnePage('new_job');

            }
            
        }


        $scope.addPointInSection = function (section) {
            section.points.push({ title: "" })
        }
        $scope.addNewSection = function () {
            var section = { title: "", description: "", points: [{ title: "" }] };
            $scope.job.sections.push(section)
        }
        $scope.removePointInSection = function (section, index) {
            section.points.splice(index, 1);
        }
        $scope.removeSection = function (index) {
            $scope.job.sections.splice(index, 1);
        }
        $scope.addNewJob = function (job) {
            if(job.degree == ""){
                job.degree = undefined;
            }
            if (!job.id) {
                job.creator = $rootScope.getcurrentUser();
                adminService.createJobPost(job, function (res, err) {
                    if (!err) {
                        SweetAlert.swal({
                            title: "The Job added successfully",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonColor: "#32904f", confirmButtonText: "Add new job",
                            cancelButtonText: "Go to jobs page",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                            function (isConfirm) {
                                if (isConfirm) {
                                    $window.location.reload();
                                } else {
                                    $scope.opnePage('jobs');
                                }
                            });
                    } else {
                        SweetAlert.swal("Error", "an error occuers", "error");
                    }
                });
            } else if (job.id) {
                job.creator = $rootScope.getcurrentUser();
                adminService.updateJobPost(job.id, job, function (res, err) {
                    if (!err) {
                        SweetAlert.swal({
                            title: "The Job updated successfully",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonColor: "#32904f", confirmButtonText: "update job post",
                            cancelButtonText: "Go to jobs page",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                            function (isConfirm) {
                                if (isConfirm) {
                                    $window.location.reload();
                                } else {
                                    $scope.opnePage('jobs');
                                }
                            });
                    } else {
                        SweetAlert.swal("Error", "an error occuers", "error");
                    }
                        // SweetAlert.swal("Good job!", "The Job updated successfully", "success");
                });
            }
        }

        $scope.getCities = function (country, city) {
            
            country = JSON.parse(country)
            adminService.getCities(country, function (res, err) {
                if (!err) {
                    $scope.cities = res.data;
                    if (!city) {
                        $scope.org.selectedCity = ""
                        $scope.job.selectedCity = ""
                    }else{
                        // city = JSON.parse(city)
                        $scope.cities.forEach(element => {
                            if(element.id == city.id){
                                $scope.job.selectedCity = JSON.stringify(element);
                                $scope.org.selectedCity = JSON.stringify(element)
                            }
                        });
                        
                    }

                    // $scope.cities.forEach(element => {
                    //     if(element.id == city.id){
                    //         $scope.job.selectedCity = element
                    //     }
                    // });
                }
            });
        }
        $scope.getCityData = function (selectedCity) {
            selectedCity = JSON.parse(selectedCity)
            $scope.org.lat = selectedCity.lat;
            $scope.org.long = selectedCity.long;
        }
        $scope.up2 = {};

        $scope.addNewOrganization = function (up, model) {
            debugger;
            creator = $rootScope.getcurrentUser();
            if (!model.id) {
                if (!up.file) {

                    modelObject = { name: model.name, email: model.email, phone: model.phone, website: model.webSite, description: model.description, address: model.address, postcode: model.postcode, lat: model.lat, long: model.long, facebook: model.facebook, twitter: model.twitter, googlePlus: model.googlePlus, youtube: model.youtube, vimeo: model.vimeo, linkedin: model.linkedin, creatorId: creator.id };
                    // debugger;
                    // cityId: JSON.parse(model.selectedCity).id
                    if(model.selectedCity != undefined && model.selectedCity.length > 0){
                        modelObject.cityId = JSON.parse(model.selectedCity).id
                    }
                    // if (creator.role == "ADMIN") {
                    //     modelObject.approvedByAdmin = false;
                    // } else if (creator.role == "SUPER_ADMIN") {
                        modelObject.approvedByAdmin = true;
                    // }
                    adminService.creatNewOrganization(modelObject, function (res, err) {
                        if (!err) {
                            SweetAlert.swal("Good job!", "The Organiztion added successfully", "success");
                            $scope.org = {};
                            $scope.up2 = {};
                            $scope.OrganizationImageProgress = 0;
                            $scope.opnePage('organizations');
                        } else {
                            SweetAlert.swal("Error", "an error occuers", "error");
                        }
                    })
                }else{
                    Upload.upload({
                        url: $rootScope.backendURL + 'upload',
                        data: { file: up.file }
                    }).then(function (resp) {
                        if (resp.data.error_code === 0) {
    
                            modelObject = { name: model.name, email: model.email, phone: model.phone, website: model.webSite, description: model.description, mainImageId: resp.data.insertedFile.id, address: model.address, postcode: model.postcode, lat: model.lat, long: model.long, facebook: model.facebook, twitter: model.twitter, googlePlus: model.googlePlus, youtube: model.youtube, vimeo: model.vimeo, linkedin: model.linkedin, creatorId: creator.id };
                            // debugger;
                            // cityId: JSON.parse(model.selectedCity).id
                            if(model.selectedCity != undefined && model.selectedCity.length > 0){
                                modelObject.cityId = JSON.parse(model.selectedCity).id
                            }
                            // if (creator.role == "ADMIN") {
                            //     modelObject.approvedByAdmin = false;
                            // } else if (creator.role == "SUPER_ADMIN") {
                                modelObject.approvedByAdmin = true;
                            // }
                            adminService.creatNewOrganization(modelObject, function (res, err) {
                                if (!err) {
                                    SweetAlert.swal("Good job!", "The Organiztion added successfully", "success");
                                    $scope.org = {};
                                    $scope.up2 = {};
                                    $scope.OrganizationImageProgress = 0;
                                    $scope.opnePage('organizations');
                                } else {
                                    SweetAlert.swal("Error", "an error occuers", "error");
                                }
                            })
                        } else {
                            SweetAlert.swal("Error", "an error occuers", "error");
    
                        }
                    }, function (resp) {
                        SweetAlert.swal("Error", "an error occuers", "error");
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.OrganizationImageProgress = 'progress: ' + progressPercentage + '% ';
                    });
                }
                
            } else {

                if (!up.file) {
                    modelObject = { name: model.name, email: model.email, phone: model.phone, website: model.webSite, description: model.description, address: model.address, postcode: model.postcode, lat: model.lat, long: model.long, facebook: model.facebook, twitter: model.twitter, googlePlus: model.googlePlus, youtube: model.youtube, vimeo: model.vimeo, linkedin: model.linkedin};
                    // cityId: JSON.parse(model.selectedCity).id
                    if(model.selectedCity != undefined && model.selectedCity != "null" && model.selectedCity.length > 0){
                        modelObject.cityId = JSON.parse(model.selectedCity).id
                    }
                    modelObject.approvedByAdmin = true;
                    adminService.updateOrganization(model.id, modelObject, function (res, err) {
                        if (!err) {
                            SweetAlert.swal("Good job!", "The Organiztion Updated successfully", "success");
                            $scope.org = {};
                            $scope.up2 = {};
                            $scope.OrganizationImageProgress = 0;
                            $scope.opnePage('organizations');
                        } else {
                            SweetAlert.swal("Error", "an error occuers", "error");
                        }
                    })


                } else {
                    Upload.upload({
                        url: $rootScope.backendURL + 'upload',
                        data: { file: up.file }
                    }).then(function (resp) {
                        if (resp.data.error_code === 0) {
                            modelObject = { name: model.name, email: model.email, phone: model.phone, website: model.webSite, description: model.description, address: model.address, postcode: model.postcode, lat: model.lat, long: model.long, facebook: model.facebook, twitter: model.twitter, googlePlus: model.googlePlus, youtube: model.youtube, vimeo: model.vimeo, linkedin: model.linkedin, cityId: JSON.parse(model.selectedCity).id };
                            modelObject.mainImageId = resp.data.insertedFile.id;
                            adminService.updateOrganization(model.id, modelObject, function (res, err) {
                                if (!err) {
                                    SweetAlert.swal("Good job!", "The Organiztion Updated successfully", "success");
                                    $scope.org = {};
                                    $scope.up2 = {};
                                    $scope.OrganizationImageProgress = 0;
                                    $scope.opnePage('organizations');
                                } else {
                                    SweetAlert.swal("Error", "an error occuers", "error");
                                }
                            })
                        }
                    })
                }


            }
        }
        function getTotalPages(limit, size) {
            return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
        }

        $scope.openFileUploader = function (id) {
            document.getElementById(id).click();
        }
        $scope.init();

        $scope.resetPasswordObject = {};
        $scope.resetPassword = function () {
            if ($scope.resetPasswordObject.newPassword != $scope.resetPasswordObject.confirmNewPassword) {
                SweetAlert.swal("Error", "New password doesn't match confirm new password field", "error");
                return;
            }

            adminService.resetPassword({
                password: $scope.resetPasswordObject.newPassword,
                oldPassword: $scope.resetPasswordObject.oldPassword
            }, function (res, err) {
                if (err) {
                    SweetAlert.swal("Error", err.data, "error");
                } else {
                    SweetAlert.swal("Done", "", "success");
                    $rootScope.signOut();
                }
            });
        }



        /**
         * Typeahead.js configuration
         */
        $(document).ready(function () {
            var organizationsAutoComplete = new Bloodhound({
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
                minLength: 1
            }, {
                    name: 'Organizations',
                    display: 'name',
                    source: organizationsAutoComplete,
                });

            var tagsAutoComplete = new Bloodhound({
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
                minLength: 1
            }, {
                    name: 'Tags',
                    display: 'name',
                    source: tagsAutoComplete,
                });

            var adminsAutoComplete = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                // `states` is an array of state names defined in "The Basics"
                remote: {
                    url: $rootScope.backendURL + 'typeahead/admin?q=%QUERY',
                    wildcard: '%QUERY'
                }
            });

            $('.admin_typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                    name: 'Admins',
                    display: 'name',
                    source: adminsAutoComplete,
                });

            var jobsAutoComplete = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                // `states` is an array of state names defined in "The Basics"
                remote: {
                    url: $rootScope.backendURL + 'typeahead/job?q=%QUERY',
                    wildcard: '%QUERY'
                }
            });

            $('.job_typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                    name: 'Job_title',
                    display: 'title',
                    source: jobsAutoComplete,
                });
        });

    });