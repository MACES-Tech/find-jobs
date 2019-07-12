angular.module('jobs').controller('contactController', function ($route, $rootScope, $scope, $location, SweetAlert, contactService) {
    $scope.form = { name: '', email: '', phoneNumber: '', subject: '', description: '', };
    $scope.sendMail = function () {
        if ($scope.form.description.length > 0) {
            contactService.sendMail($scope.form, function (res, err) {
                SweetAlert.swal("Done", "Your message sent sucessfully, We will get back to you soon", "success");
                $scope.form = { name: '', email: '', phoneNumber: '', subject: '', description: '', };

            });
        }

    }
});