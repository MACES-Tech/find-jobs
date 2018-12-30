var app = angular.module('buildingChain');

function APIInterceptorImp($rootScope) {
    this.request = function (config) {	
				$rootScope.rootLoading = true;
		if (config.url.indexOf($rootScope.backendURL) > -1) {
				if ($rootScope.isSignedIn()) {
						config.headers.Authorization = "JWT " + $rootScope.getCurrentToken();
				}
		}
			return config;
    };

    this.response = function (response) {
			
			$rootScope.rootLoading = false;
			return response;
    };

    this.responseError = function (response) {
		$rootScope.rootLoading = false;
		if (response.status == 802 && $rootScope.isSignedIn()) {			
		} else {
			if (response.status == 404 || response.status == 500 || response.status == 401) {
		
			}
		}
		return response;
    };
}

app.service('APIInterceptor', ['$rootScope', APIInterceptorImp]);
