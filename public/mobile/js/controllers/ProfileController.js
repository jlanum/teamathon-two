SporkitControllerModule.controller('ProfileController', ['$scope', 'Facebook',
function($scope, Facebook) {
    Facebook.getFriends();
    $scope.currentUser = Parse.User.current();
    var Sporks = Parse.Object.extend("Spork");
    var sporkQuery = new Parse.Query(Sporks);

    $scope.getCurrentLocationAddress = function() {
        var address;
        if ($scope.currentUser.attributes.fbUserData.location) {
            address = $scope.currentUser.attributes.fbUserData.location;
        } else if (Facebook.currentLocationAddress0) {
            address = Facebook.currentLocationAddress0;
        } else {
            address = "Unknown";
        }
        return address;
    };

    $scope.getSporkedFoods = function() {
        sporkQuery.equalTo("createdBy", $scope.currentUser);
        sporkQuery.include("food");
        sporkQuery.find({
            success : function(results) {
                $scope.sporkedFoodsByCurrentUser = [];
                for(var i=0; i < results.length; i++){
                $scope.sporkedFoodsByCurrentUser.push(results[i].get('food'));
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            },
            error : function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    };

    $scope.$on('fb-get-friends-onsuccess', function(event, response) {
        $scope.nooffriends = response.data.length;
        // $.each(response.data, function(index, friend) {
        // console.log(friend.name + ' has id:' + friend.id);
        // });
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    Facebook.getAllFoods($scope.currentUser);
    $scope.getSporkedFoods();

    $scope.$on('get-all-foods-onsuccess', function(event, response) {
        $scope.foods = response;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });
}]);
