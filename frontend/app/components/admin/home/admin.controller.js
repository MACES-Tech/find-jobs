angular.module('jobs')
    .controller('adminController', function ($rootScope, $scope, $location,$route,adminService,Upload,SweetAlert ) {

        $scope.pages=[
            {
                title: "Manage Organizations",
                html:"./app/components/admin/page-content/organization-page.html",
                icon:"careerfy-business",
                url:"organizations",
                showInList:true,
                function:getManageOrgainzationPage
            },
            {
                title: "New organization",
                html:"./app/components/admin/page-content/new-Organization.html",
                url:"new_organization",
                icon:"careerfy-plus",
                showInList:true,
                function:getNewOrgainzationPage
            },
            {
                title:"Manage Jobs",
                html:"./app/components/admin/page-content/manage-jobs.html",
                icon:"careerfy-briefcase-1",
                url:"jobs",
                showInList:true
            },
            {
                title:"Tags",
                html:"",
                icon:"careerfy-salary",
                url:"tags",
                showInList:true
            },{
                title:"Users",
                html:"",
                icon:"careerfy-group",
                url:"users",
                showInList:true
            },{
                title:"Post a New Job",
                html:"",
                icon:"careerfy-plus",
                url:"new_job",
                showInList:true
            },{
                title:"Subscriptions List",
                html:"",
                icon:"careerfy-alarm",
                url:"subscription_list",
                showInList:true
            },
            {
                title: "Change password",
                html:"./app/components/admin/page-content/change-password.html",
                icon:"careerfy-multimedia",
                url:"change_password",
                showInList:true
            }
        ]
        $scope.notFoundPage = {
            title: "Not found",
            html:"./app/components/admin/page-content/not-found.html",
            url:"not_found"
        }
const numberOfitemPerPages = 9;
        // $scope.org={name:"Enter Name",industry:"Banking",hotLine:"19600",email:"dum72@gmail.com","webSite":" http://themeforest.net"}
        $scope.opnePage = function(pageUrl){
            $location.path ('/admin/home',false).search({page: pageUrl});
            setCurrentPage(($location.search()).page);
            
        }
        $scope.init = function(){
            if(!$rootScope.isAdmin()){
                $rootScope.goTopage("/");
                return;
            }
            if(!($location.search()).page){
                // $scope.opnePage($scope.pages[0].url);
                $location.path ('/admin/home',false).search({page: $scope.pages[0].url});
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
            if($scope.currentPage)
                getPageContent($scope.currentPage)
        }

        function getPageContent(page){
            if(page.function)
                page.function();
        }

        $scope.getManageOrgainzationPage = function(pageNumber){
            getManageOrgainzationPage(pageNumber)
        }
        function getManageOrgainzationPage(pageNumber){
            if(!pageNumber){
                pageNumber = 1;
            }
            $scope.currentPageNumberInOrganizationPage = pageNumber;
            adminService.getOrganizations(pageNumber,numberOfitemPerPages,function(res,err){
                $scope.organizations = res.data.organizations;
                console.log($scope.organizations);
                
                $scope.numberOfPagesInOrganizationPage = getTotalPages(numberOfitemPerPages,res.data.count);
            })
        }
        $scope.org={}
        function getNewOrgainzationPage(){
            adminService.getCountries(function(res,err){
                if(!err){
                    $scope.countries = res.data;
                }
            })
        }
        $scope.getCities = function(country){
            $scope.org.selectedCity = ""
            country = JSON.parse(country)
            adminService.getCities(country,function(res,err){
                if(!err){
                    $scope.cities = res.data;
                }
            })
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
                        modelObject = {name:model.name, email:model.email, phone:model.phone,website:model.webSite,description:model.description, mainImageId:resp.data.insertedFile.id,address:model.address,postcode:model.postcode,lat:model.lat,long:model.long,facebook:model.facebook,twitter:model.twitter,googlePlus:model.googlePlus,youtube:model.youtube,vimeo:model.vimeo,linkedin:model.linkedin,cityId:JSON.parse(model.selectedCity).id,industry:model.industry};
                        adminService.creatNewOrganization(modelObject,function(res,err){
                            if(!err){
                                SweetAlert.swal("Good job!", "The Image added successfully", "success");
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
        $scope.init()


});