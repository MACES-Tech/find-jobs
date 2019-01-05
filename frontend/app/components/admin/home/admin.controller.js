angular.module('jobs')
    .controller('adminController', function ($rootScope, $scope, $location,$route) {

        $scope.pages=[
            {
                title: "Manage Organizations",
                html:"./app/components/admin/page-content/organization-page.html",
                icon:"careerfy-business",
                url:"organizations"
            },
            {
                title:"Manage Jobs",
                html:"./app/components/admin/page-content/manage-jobs.html",
                icon:"careerfy-briefcase-1",
                url:"jobs"
            },
            {
                title:"Tags",
                html:"",
                icon:"careerfy-salary",
                url:"tags"
            },{
                title:"Users",
                html:"",
                icon:"careerfy-group",
                url:"users"
            },{
                title:"Post a New Job",
                html:"",
                icon:"careerfy-plus",
                url:"new_job"
            },{
                title:"Subscriptions List",
                html:"",
                icon:"careerfy-alarm",
                url:"subscription_list"
            },
            {
                title: "Change password",
                html:"./app/components/admin/page-content/change-password.html",
                icon:"careerfy-multimedia",
                url:"change_password"
            }
        ]
        $scope.notFoundPage = {
            title: "Not found",
            html:"./app/components/admin/page-content/not-found.html",
            url:"not_found"
        }
        $scope.opnePage = function(pageUrl){
            $location.path ('/admin/home',false).search({page: pageUrl});
            setCurrentPage(($location.search()).page)
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
        }
        $scope.init()


});