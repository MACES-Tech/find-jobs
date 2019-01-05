angular.module('jobs')
    .controller('appController', function ($http, $rootScope, $scope,$location,$cookies,$route,$window) {
       
        $rootScope.default_float =  'float-r' ;
        $rootScope.rootLoading = false;
    $rootScope.isSignedIn = function () {
        return $cookies.get('currentUser.token') !== undefined;
    }

    $rootScope.goTopage = function(PageName){
        $location.url(PageName);
    }
    
    $rootScope.setcurrentUser = function (admin, token) {
        $cookies.put("currentUser.object", admin);
        $cookies.put("currentUser.token", token);
        $rootScope.goTopage("/admin/home");
    }
    $rootScope.updateCurrentUser = function (admin) {
        $cookies.put("currentUser.object", admin);        
    }
    

    $rootScope.getcurrentUser = function () {
        if ($rootScope.isSignedIn()) {
            return JSON.parse($cookies.get('currentUser.object'));
        } else {
            return undefined;
        }
    }

    $rootScope.isAdmin = function () {
        admin = $rootScope.getcurrentUser();
        if (admin && (admin.role == "SUPER_ADMIN")) {
            return true;
        }
        return false;
    }

    $rootScope.getCurrentToken = function () {
        return $cookies.get('currentUser.token');
    }

    $rootScope.unsetcurrentUser = function () {
        $cookies.remove('currentUser.object');
        $cookies.remove('currentUser.token');
    }

    $rootScope.signOut = function () {
                $rootScope.unsetcurrentUser();
                $rootScope.goTopage("/")

    }
    $rootScope.$on('$locationChangeSuccess', function () {
        var url = window.location.href;
        if (url.indexOf("?#") === -1 && url.indexOf("#") !== -1)
            window.location.href = url.replace("#", "?#")

        $rootScope.rootLoading = false;
    });

    $rootScope.$on('$locationChangeSuccess', function () {
        $rootScope.rootLoading = false;
    });

});