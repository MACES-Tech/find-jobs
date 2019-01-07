angular.module('jobs')
    .controller('footerController', function ($rootScope, $scope, $location, loginRegisterService,SweetAlert) {
        $scope.email = "";
        $scope.password = "";
        $scope.error = "";
        $scope.registerModel = {
            name:"",
            phone:"",
            email:"",
            password:""
        }
        $scope.login = function(email,password){
            $scope.error ="";
            if(!email){
                $scope.error = "Email & Password are mandatory!"
            }else if (!password){
                $scope.error = "Email & Password are mandatory!"
            }else{
                var loginObject = {"email":email,"password":password}
                loginRegisterService.login(loginObject,function(res,err){
                    if(err || res.status == 401){
                        $scope.error = "You are not allowed to login!"
                    }else{
                        $rootScope.setcurrentUser(JSON.stringify(res.data.user), res.data.token);
                        $scope.closePopup();
                    }
                    
                });
            }
        }
        $scope.closePopup = function(){
            var script = document.createElement('script');
            script.src = "assets/js/hideModal.js";
            document.head.appendChild(script)
        }
        $scope.register = function(name , email,password,phone){
            debugger
            if(!email){
                SweetAlert.swal("Error", "an error occuers email", "error");
            }else if (!password){
                SweetAlert.swal("Error", "an error occuers passsword", "error");
            }else if(!name){
                SweetAlert.swal("Error", "an error occuers name", "error");
            }else if(!phone){
                SweetAlert.swal("Error", "an error occuers phone", "error");
            }else{
                var registerObject = {"email":email,"password":password,"name":name,"phone":phone,"role":"user"};
                loginRegisterService.register(registerObject,function(res,err){
                    if(err){
                        SweetAlert.swal("Error", err, "error");
                    }else{
                        $scope.login(email,password);
                    }
                    
                });
            }
        }
});