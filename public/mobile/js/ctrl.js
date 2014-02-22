var SporkitControllerModule = angular.module('SporkitControllerModule', []);
SporkitControllerModule.controller('SporkitMainController', ['$scope', 'Facebook',
function($scope, Facebook) {

    $scope.currentUser = Facebook.currentUser;
    $scope.isLoggedIn = false;

    $scope.login = function() {
        Facebook.login();
    };
    $scope.logout = function() {
        Facebook.logout();
    };
    $scope.unsubscribe = function() {
        Facebook.unsubscribe();
    };
    $scope.getLoginStatus = function() {
        Facebook.getLoginStatus();
    };

    $scope.$on('get-fb-login-status', function(event, response) {
        $scope.loginStatusObj = response;
        $scope.fb_status = response.status;
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            $scope.isLoggedIn = true;
        } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook,
            // but has not authenticated your app
            alert('User has not authorized Spork.it app');
        } else {
            // the user isn't logged in to Facebook.
            $scope.isLoggedIn = false;
        }
        console.log($scope.isLoggedIn);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    $scope.$on('fb-login-onsuccess', function(event, response) {
        Facebook.getLoginStatus();
    });

    $scope.$on('fb-logout-onsuccess', function(event, response) {
        Facebook.getLoginStatus();
    });

}]);
