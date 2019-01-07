var app = angular.module('jobs');

app.service('adminService', function ($http, $rootScope) {
    var self = this;

    self.creatNewOrganization = function(org,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "organization",
            data:JSON.stringify(org)
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
    self.getOrganizations = function(pageNumber,itemsPerPage,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "organization?pageNumber="+pageNumber+"&itemsPerPage="+itemsPerPage
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };

    self.getTags = function(pageNumber,itemsPerPage,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "tag?pageNumber="+pageNumber+"&itemsPerPage="+itemsPerPage
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };

    self.deleteTag = function(tagId,cb){
        $http({
            method: 'DELETE',
            url: $rootScope.backendURL + "tag/" + tagId
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            });
    };

    self.updateTag = function(tag,cb){
        $http({
            method: 'PUT',
            url: $rootScope.backendURL + "tag/" + tag.id,
            data:JSON.stringify(tag)
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            });
    };

    self.addNewTag = function(tag,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "tag",
            data:JSON.stringify(tag)
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            });
    };

    self.getAdmins = function(pageNumber,itemsPerPage,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "user?pageNumber="+pageNumber+"&itemsPerPage="+itemsPerPage
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };

    self.deleteAdmin = function(adminId,cb){
        $http({
            method: 'DELETE',
            url: $rootScope.backendURL + "user/" + adminId
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            });
    };

    self.updateAdmin = function(admin,cb){
        $http({
            method: 'PUT',
            url: $rootScope.backendURL + "user/" + admin.id,
            data:JSON.stringify(admin)
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            });
    };

    self.addNewAdmin = function(admin,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "register",
            data:JSON.stringify(admin)
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            });
    };

    self.getCountries = function(cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "country"
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
    self.getCities = function(country,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "country/"+country.id +"/city"
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
    
    self.getAllTags = function(cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "tags",
            cash: true
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
    self.createJobPost = function(job,cb){
        $http({
            method: 'POST',
            url: $rootScope.backendURL + "job",
            data:JSON.stringify(job)
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };

    self.getJobs = function(pageNumber,itemsPerPage,cb){
        $http({
            method: 'GET',
            url: $rootScope.backendURL + "job?pageNumber="+pageNumber+"&itemsPerPage="+itemsPerPage
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };

    self.deleteJobPost = function(jobId,cb){
        $http({
            method: 'DELETE',
            url: $rootScope.backendURL + "job/"+jobId
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };

    self.deleteOrganization = function(jobId,cb){
        $http({
            method: 'DELETE',
            url: $rootScope.backendURL + "organization/"+jobId
        }).then(
            function successCallback(res) {
                if (res.status == 500) {
                    cb(null, res);
                } else {
                    cb(res);
                }
            },
            function errorCallback(err) {
                cb(null, err);
            })
    };
})