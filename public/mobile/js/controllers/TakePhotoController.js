SporkitControllerModule.controller('TakePhotoController', ['$scope', 'Facebook',
function($scope, Facebook) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.lat = position.coords.latitude;
            $scope.lon = position.coords.longitude;
            console.log($scope.lat + ', ' + $scope.lon);
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }
    $scope.food = {};
    $scope.saveFood = function() {
        var fileUploadControl = $("#profilePhotoFileUpload")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "photo.jpg";

            var parseFile = new Parse.File(name, file);
        }

        var Users = Parse.Object.extend("User");
        var Foods = Parse.Object.extend("Food");

        var selectedRestaurantObj = $.grep($scope.restaurantsResult, function(e) {
            return e.name == $scope.selectedRestaurantName;
        });
        var currentLocation = new Parse.GeoPoint({
            latitude : $scope.lat,
            longitude : $scope.lon
        });

        var currentUser = Parse.User.current();
        var food = new Foods({
            name : $scope.food.name,
            geoPoint : currentLocation,
            restaurant : selectedRestaurantObj[0],
            photo : parseFile
        });
        food.set("createdBy", currentUser);
        food.save();
    };
    $scope.nearByRestaurantNames = [];
    $scope.$on('search-restaurants-onsuccess', function(event, response) {
        $scope.restaurantsResult = response.businesses;
        console.log(response.businesses);
        for (var i = 0; i < response.businesses.length; i++) {
            $scope.nearByRestaurantNames.push(response.businesses[i].name);
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });
    $scope.callYelpForMatchingRestaurants = function() {
        var searchterm = $('#restaurantInput').val();
        Facebook.callYelp({
            'action' : 'http://api.yelp.com/v2/search?category_filter=restaurants&sort=1&limit=10&term=' + searchterm + '&ll=' + $scope.lat + ',' + $scope.lon,
            'method' : 'GET',
            'callbackId' : 'search-restaurants'
        });
    };
    $scope.previewImage = function() {
        var input = $("#profilePhotoFileUpload")[0];
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreviewer').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

}]);
