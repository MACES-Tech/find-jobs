angular.module('jobs')
    .controller('adminController', function ($rootScope, $scope, $location,$route,adminService,Upload,SweetAlert ) {

        $scope.pages=[
            {
                title: "Manage Organizations",
                html:"./app/components/admin/page-content/organization-page.html",
                icon:"careerfy-business",
                url:"organizations",
                showInList:true,
                function:getManageOrgainzationPage,
                authority:['SUPER_ADMIN','ADMIN']
            },
            {
                title: "New organization",
                html:"./app/components/admin/page-content/new-Organization.html",
                url:"new_organization",
                icon:"careerfy-plus",
                showInList:true,
                function:getNewOrgainzationPage,
                authority:['SUPER_ADMIN','ADMIN']
            },
            {
                title:"Manage Jobs",
                html:"./app/components/admin/page-content/manage-jobs.html",
                icon:"careerfy-briefcase-1",
                url:"jobs",
                showInList:true,
                function:getManageJobsPage,
                authority:['SUPER_ADMIN','ADMIN']
            },
            {
                title:"Tags",
                html:"./app/components/admin/page-content/manage-tags.html",
                icon:"careerfy-salary",
                url:"tags",
                showInList:true,
                function:getManageTagsPage,
                authority:['SUPER_ADMIN','ADMIN']
            },{
                title:"Admins",
                html:"./app/components/admin/page-content/manage-admins.html",
                icon:"careerfy-group",
                url:"admins",
                showInList:true,
                authority:['SUPER_ADMIN'],
                function:getManageAdminsPage
            },{
                title:"Post a New Job",
                html:"./app/components/admin/page-content/new-job.html",
                icon:"careerfy-plus",
                url:"new_job",
                showInList:true,
                function:getNewJobPage,
                authority:['SUPER_ADMIN','ADMIN']
            },{
                title:"Subscriptions List",
                html:"",
                icon:"careerfy-alarm",
                url:"subscription_list",
                showInList:true,
                authority:['SUPER_ADMIN']
            },
            {
                title: "Change password",
                html:"./app/components/admin/page-content/change-password.html",
                icon:"careerfy-multimedia",
                url:"change_password",
                showInList:true,
                authority:['SUPER_ADMIN','ADMIN']
            }
        ]
        $scope.notFoundPage = {
            title: "Not found",
            html:"./app/components/admin/page-content/not-found.html",
            url:"not_found",
            authority:['SUPER_ADMIN','ADMIN']
        }
        const numberOfitemPerPages = 9;
        // $scope.org={name:"Enter Name",industry:"Banking",hotLine:"19600",email:"dum72@gmail.com","webSite":" http://themeforest.net"}
        $scope.opnePage = function(pageUrl){
            $location.path ('/admin/home',false).search({page: pageUrl});
            setCurrentPage(($location.search()).page);
            
        }
        $scope.hasAuthorityToViewPage = function(page){
            const userRole = $rootScope.getcurrentUser().role;
            if(page.authority.indexOf(userRole) > -1){
                return true;
            }
            else{
                return false;
            }
        }
        $scope.init = function(){
            if(!$rootScope.isAdmin()){
                $rootScope.goTopage("/");
                return;
            }
            if(!($location.search()).page){
                // $scope.opnePage($scope.pages[0].url);
                if($rootScope.getcurrentUser().role ==='SUPER_ADMIN')
                    $location.path ('/admin/home',false).search({page: $scope.pages[0].url});
                else{
                    $location.path ('/admin/home',false).search({page: $scope.pages[5].url});
                }
                }else{
                    $location.path ('/admin/home',false).search({page: ($location.search()).page});
                }
            setCurrentPage(($location.search()).page)
        }
        function setCurrentPage(pageUrl){
            
            $scope.currentPage=undefined;
            $scope.pages.forEach(element => {
                if(element.url === pageUrl){
                    $scope.currentPage = element
                    return;
                }
            });
            if(!$scope.currentPage){
                $scope.currentPage = $scope.notFoundPage;
            }
            if($scope.currentPage && $scope.hasAuthorityToViewPage($scope.currentPage))
                getPageContent($scope.currentPage)
            else{
                $scope.currentPage = $scope.notFoundPage;
                getPageContent($scope.currentPage)
            }
                
        }

        function getPageContent(page){
            if(page.function)
                page.function();
        }

        $scope.getManageOrgainzationPage = function(pageNumber){
            getManageOrgainzationPage(pageNumber);
        }
        function getManageOrgainzationPage(pageNumber){
            if(!pageNumber){
                pageNumber = 1;
            }
            $scope.currentPageNumberInOrganizationPage = pageNumber;
            if($rootScope.getcurrentUser().role =="ADMIN")
                adminId = $rootScope.getcurrentUser().id
            adminService.getOrganizations(pageNumber,numberOfitemPerPages,function(res,err){
                $scope.organizations = res.data;
                console.log($scope.organizations);
                
                $scope.numberOfPagesInOrganizationPage = getTotalPages(numberOfitemPerPages,res.data[0].organizationsCount);
            })
        }

        /*
        *   Tags Section
        */
        $scope.newTag = {};
        $scope.getManageTagsPage = function(pageNumber){
            getManageTagsPage(pageNumber);
        };

        function getManageTagsPage(pageNumber){
            if(!pageNumber){
                pageNumber = 1;
            }
            $scope.currentPageNumberInTagsPage = pageNumber;
            adminService.getTags(pageNumber,numberOfitemPerPages,function(res,err){
                $scope.tags = res.data;                
                $scope.numberOfPagesInTagsPage = getTotalPages(numberOfitemPerPages,res.data[0].tagsCount);
            });
        }

        $scope.deleteTag = function(tag){
            SweetAlert.swal({
                title: "Are you sure?",
                text: "You will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false }, 
             function(isConfirm){ 
                if (isConfirm) {
                    adminService.deleteTag(tag.id,function(res,err){
                        if(!err){
                            var index = $scope.tags.indexOf(tag);
                            $scope.tags.splice(index, 1); 
                            SweetAlert.swal("Done", "Tag deleted successfully", "success");
                        }else{
                            SweetAlert.swal("Error", "an error occuers", "error");
                        }
                    });
                } else {
                   SweetAlert.swal("Cancelled", "Your data is safe :)", "error");
                }
             });
        };

        $scope.updateTagKeyPressed = function(tag, $event){
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                // Do that thing you finally wanted to do
                $scope.updateTag(tag);
            }
        };

        $scope.updateTag = function(tag){
            if(!tag.editMode){
                tag.editMode = !tag.editMode;
                return;
            }
            tag.editMode = !tag.editMode;
            adminService.updateTag(tag, function(res, err){
                if(err){
                    SweetAlert.swal("Error", "an error occuers", "error");
                }else{
                    SweetAlert.swal("Done", "", "success");
                }
            });
        };

        $scope.addNewTag = function(){
            adminService.addNewTag($scope.newTag, function(res, err){
                if(err){
                    SweetAlert.swal("Error", "an error occuers", "error");
                }else{
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
        $scope.getManageAdminsPage = function(pageNumber){
            getManageAdminsPage(pageNumber);
        };

        function getManageAdminsPage(pageNumber){
            if(!pageNumber){
                pageNumber = 1;
            }
            $scope.currentPageNumberInAdminsPage = pageNumber;
            adminService.getAdmins(pageNumber,numberOfitemPerPages,function(res,err){
                $scope.admins = res.data.users;                
                $scope.numberOfPagesInAdminsPage = getTotalPages(numberOfitemPerPages,res.data.count);
            });
        }

        $scope.deleteAdmin = function(admin){
            SweetAlert.swal({
                title: "Are you sure?",
                text: "You will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false }, 
             function(isConfirm){ 
                if (isConfirm) {
                    adminService.deleteAdmin(admin.id,function(res,err){
                        if(!err){
                            var index = $scope.admins.indexOf(admin);
                            $scope.admins.splice(index, 1); 
                            SweetAlert.swal("Done", "Admin deleted successfully", "success");
                        }else{
                            SweetAlert.swal("Error", "an error occuers", "error");
                        }
                    });
                } else {
                   SweetAlert.swal("Cancelled", "Your data is safe :)", "error");
                }
             });
        };

        $scope.updateAdminKeyPressed = function(admin, $event){
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                // Do that thing you finally wanted to do
                $scope.updateAdmin(admin);
            }
        };

        $scope.updateAdmin = function(admin){
            if(!admin.editMode){
                admin.editMode = !admin.editMode;
                return;
            }
            admin.editMode = !admin.editMode;
            adminService.updateAdmin(admin, function(res, err){
                if(err){
                    SweetAlert.swal("Error", "an error occuers", "error");
                }else{
                    SweetAlert.swal("Done", "", "success");
                }
            });
        };

        $scope.addNewAdmin = function(){
            $scope.newAdmin.role = "ADMIN";
            adminService.addNewAdmin($scope.newAdmin, function(res, err){
                if(err){
                    SweetAlert.swal("Error", "an error occuers", "error");
                }else{
                    $scope.newAdmin = {};
                    $scope.admins.splice(0, 0, res.data.user);
                    SweetAlert.swal("Done", "", "success");
                }
            });
        };

        
        $scope.getManageJobsPage = function(pageNumber){
            getManageJobsPage(pageNumber)
        }
        function getManageJobsPage(pageNumber){
            if(!pageNumber){
                pageNumber = 1;
            }
            $scope.currentPageNumberInJobsPage = pageNumber;
            adminId = "";
            if($rootScope.getcurrentUser().role =="ADMIN")
                adminId = $rootScope.getcurrentUser().id
            adminService.getJobs(pageNumber,numberOfitemPerPages,function(res,err){
                if(!err){
                    $scope.jobs = res.data.jobs;
                    console.log( $scope.jobs);
                    $scope.numberOfPagesInJobsPage = getTotalPages(numberOfitemPerPages,res.data.count);
                }
            },adminId)
        }
        $scope.approvejobPost= function(jobId,index){
            updatedObject={status:"Active"}
            adminService.updateJobPost(jobId,updatedObject,function(res,err){
                if(!err){
                    $scope.jobs[index].status = 'Active'
                    SweetAlert.swal("Good job!", "The Job Approved successfully", "success");
                }else{
                    SweetAlert.swal("Error", "an error occuers", "error");
                }
            })
        }
        $scope.deleteJobPost = function(jobId,index){
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false }, 
             function(isConfirm){ 
                if (isConfirm) {
                    $scope.deleteIt(jobId,index)
                } else {
                   SweetAlert.swal("Cancelled", "Your data is safe :)", "error");
                }
             });
        }
        $scope.deleteIt = function(jobId,index){
            adminService.deleteJobPost(jobId,function(res,err){
                if(!err){
                    $scope.jobs.splice(index, 1);
                    SweetAlert.swal("Deleted!", "Your data has been deleted.", "success");
                }
            })
        }
        $scope.deleteOrganization = function(orgId,index){
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false }, 
             function(isConfirm){ 
                if (isConfirm) {
                    $scope.deleteOrg(orgId,index)
                } else {
                   SweetAlert.swal("Cancelled", "Your data is safe :)", "error");
                }
             });
        }
        $scope.deleteOrg = function(orgId,index){
            adminService.deleteOrganization(orgId,function(res,err){
                if(!err){
                    $scope.organizations.splice(index, 1);
                    SweetAlert.swal("Deleted!", "Your data has been deleted.", "success");
                }
            })
        }
        
        $scope.org={}
        $scope.job={};
        $scope.job.sections=[];
        $scope.loadTags = function($query) {
                return $scope.AllTags.filter(function(tag) {
                  return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
          };
          $scope.loadOrganizations= function($query) {
            return $scope.AllOrganizations.filter(function(org) {
              return org.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
      };
        function getNewOrgainzationPage(){
            adminService.getCountries(function(res,err){
                if(!err){
                    $scope.countries = res.data;
                }
            })
        }

        function getNewJobPage(){
            adminService.getCountries(function(res,err){
                if(!err){
                    $scope.countries = res.data;
                }
            })
            adminService.getAllTags(function(res,err){
                $scope.AllTags = res.data;
            })
            adminService.getOrganizations(1,1000,function(res,err){
                $scope.AllOrganizations = res.data;
            })
            var section={title:"",description:"",points:[{title:""}]};
            $scope.job.sections.push(section)
        }
        $scope.addPointInSection = function(section){
            section.points.push({title:""})
        }
        $scope.addNewSection = function(){
            var section={title:"",description:"",points:[{title:""}]};
            $scope.job.sections.push(section)
        }
        $scope.removePointInSection = function(section,index){
            section.points.splice(index, 1);
        }
        $scope.removeSection = function(index){
            $scope.job.sections.splice(index, 1);
        }
        $scope.addNewJob = function(job){
            job.creator = $rootScope.getcurrentUser();
            console.log(job);
            adminService.createJobPost(job,function(res,err){
                if(!err){
                    SweetAlert.swal("Good job!", "The Job added successfully", "success");
                }else{
                    SweetAlert.swal("Error", "an error occuers", "error");
                }
            });
        }
        
        $scope.getCities = function(country){
            $scope.org.selectedCity = ""
            $scope.job.selectedCity = ""
            country = JSON.parse(country)
            adminService.getCities(country,function(res,err){
                if(!err){
                    $scope.cities = res.data;
                }
            });
        }
        $scope.getCityData = function(selectedCity){
            selectedCity = JSON.parse(selectedCity)
            $scope.org.lat = selectedCity.lat;
            $scope.org.long = selectedCity.long;
        }
        $scope.addNewOrganization = function(up,model){
            console.log(model);
            if(!model.id){
                Upload.upload({
                    url: $rootScope.backendURL +'upload',
                    data:{file:up.file} 
                }).then(function (resp) { 
                    if(resp.data.error_code === 0){ 
                        creator = $rootScope.getcurrentUser();
                        
                        modelObject = {name:model.name, email:model.email, phone:model.phone,website:model.webSite,description:model.description, mainImageId:resp.data.insertedFile.id,address:model.address,postcode:model.postcode,lat:model.lat,long:model.long,facebook:model.facebook,twitter:model.twitter,googlePlus:model.googlePlus,youtube:model.youtube,vimeo:model.vimeo,linkedin:model.linkedin,cityId:JSON.parse(model.selectedCity).id,approveByAdmin:true};
                        if(creator.role =="ADMIN"){
                            modelObject.approveByAdmin = false;
                        }
                        adminService.creatNewOrganization(modelObject,function(res,err){
                            if(!err){
                                SweetAlert.swal("Good job!", "The Organiztion added successfully", "success");
                                $scope.org = {};
                            }else{
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
        }
        function getTotalPages(limit, size) {
            return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
          }

        $scope.openFileUploader = function(id){
            document.getElementById(id).click();
        }
        $scope.init();

        $scope.resetPasswordObject = {};
        $scope.resetPassword = function(){
           if($scope.resetPasswordObject.newPassword != $scope.resetPasswordObject.confirmNewPassword){
                SweetAlert.swal("Error", "New password doesn't match confirm new password field", "error");
                return;
           }

           adminService.resetPassword({
               password: $scope.resetPasswordObject.newPassword,
               oldPassword: $scope.resetPasswordObject.oldPassword
           }, function(res, err){
                if(err){
                    SweetAlert.swal("Error", err.data, "error");
                }else{
                    SweetAlert.swal("Done", "", "success");
                    $rootScope.signOut();
                }
            });
        }


});