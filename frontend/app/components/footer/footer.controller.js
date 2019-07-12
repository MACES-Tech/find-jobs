angular.module('jobs')
    .controller('footerController', function ($rootScope, $scope, $location, loginRegisterService, SweetAlert, homeService) {
        $scope.email = "";
        $scope.password = "";
        $scope.error = "";
        $scope.sub = {};
        $scope.registerModel = {
            name: "",
            phone: "",
            email: "",
            password: ""
        }
        $scope.SubscriptiontypeFilter = [
            {
                id: -1,
                name: "Subscription Type"
            },
            {
                id: 2,
                name: "Daily"
            },
            {
                id: 3,
                name: "Weekly"
            },
            {
                id: 4,
                name: "monthly"
            }
        ]
        $scope.subSelectedGradeFilter = {
            id: -1,
            name: "Select Job Grade"
        };

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

            $('.sub_city_typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 0
            }, {
                    name: 'Cities',
                    display: 'name',
                    source: cityAutoComplete,
                }).bind('typeahead:select', function (ev, suggestion) {
                    $scope.sub.selectedDutyStation = suggestion;
                    // $scope.getJobs();
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





            var orgAutoComplete = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                // `states` is an array of state names defined in "The Basics"
                remote: {
                    url: $rootScope.backendURL + 'typeahead/organization?q=%QUERY',
                    wildcard: '%QUERY'
                }
            });

            $('.sub_org_typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 0
            }, {
                    name: 'Organizations',
                    display: 'name',
                    source: orgAutoComplete,
                }).bind('typeahead:select', function (ev, suggestion) {
                    $scope.sub.SubselectedOrg = suggestion;
                    // $scope.getJobs();
                });

        });



        $scope.init = function () {
            $scope.sub.selecteSubscripetype = $scope.SubscriptiontypeFilter[0];
            homeService.getGradesFilter(function (res, err) {
                if (!err) {
                    $scope.SubgradesFilter = [$scope.subSelectedGradeFilter];
                    $scope.SubgradesFilter = $scope.SubgradesFilter.concat(res.data);
                    $scope.sub.selectedGradeFilter = $scope.SubgradesFilter[0];
                }
            });
        }
        $scope.init();

        $scope.Subscribe = function () {
            console.log($scope.sub);
            if ($scope.sub.email && $scope.sub.email.length > 0) {
                loginRegisterService.subscribe($scope.sub, function (res, err) {
                    SweetAlert.swal("Done", "Thank You for subscribing  in our newsletter", "success");
                    $scope.sub = {};
                    $scope.sub.selectedGradeFilter = $scope.SubgradesFilter[0];
                    $scope.sub.selecteSubscripetype = $scope.SubscriptiontypeFilter[0];

                })
            }


        }
        $scope.login = function (email, password) {
            $scope.error = "";
            if (!email) {
                $scope.error = "Email & Password are mandatory!"
            } else if (!password) {
                $scope.error = "Email & Password are mandatory!"
            } else {
                var loginObject = { "email": email, "password": password }
                loginRegisterService.login(loginObject, function (res, err) {
                    if (err || res.status == 401) {
                        $scope.error = "You are not allowed to login!"
                    } else {
                        $rootScope.setcurrentUser(JSON.stringify(res.data.user), res.data.token);
                        $scope.closePopup();
                    }

                });
            }
        }
        $scope.closePopup = function () {
            var script = document.createElement('script');
            script.src = "assets/js/hideModal.js";
            document.head.appendChild(script)
        }
        $scope.register = function (name, email, password, phone) {
            debugger
            if (!email) {
                SweetAlert.swal("Error", "an error occuers email", "error");
            } else if (!password) {
                SweetAlert.swal("Error", "an error occuers passsword", "error");
            } else if (!name) {
                SweetAlert.swal("Error", "an error occuers name", "error");
            } else if (!phone) {
                SweetAlert.swal("Error", "an error occuers phone", "error");
            } else {
                var registerObject = { "email": email, "password": password, "name": name, "phone": phone, "role": "user" };
                loginRegisterService.register(registerObject, function (res, err) {
                    if (err) {
                        SweetAlert.swal("Error", err, "error");
                    } else {
                        $scope.login(email, password);
                    }

                });
            }
        }
    });