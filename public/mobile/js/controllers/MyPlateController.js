SporkitControllerModule.controller('MyPlateController', ['$scope', 'Facebook',
function($scope, Facebook) {
    var Sporks = Parse.Object.extend("Spork");
    var currentUser = Parse.User.current();
    var Foods = Parse.Object.extend("Food");

    Facebook.getAllFoods();

    $scope.sporkTheFood = function(foodObj) {
        var food = new Foods();
        food.id = foodObj.id;
        food.set("noOfSporks", {"__op":"Increment","amount":1});
        food.save();
        var spork = new Sporks();
        var sporkQuery = new Parse.Query(Sporks);
        sporkQuery.equalTo("createdBy", currentUser);
        sporkQuery.equalTo("food", food);
        sporkQuery.find({
            success : function(results) {
                if (results.length == 0) {
                    spork.set("createdBy", currentUser);
                    spork.set("food", food);
                    spork.save();
                    console.log('sporked it');
                } else {
                    console.log('Cannot spork again');
                }
            },
            error : function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
        Facebook.getAllFoods();
    };

    $scope.getNoOfSporksForFood = function(food){
        
    };

    $scope.$on('get-all-foods-onsuccess', function(event, response) {
        console.log(response);
        for (var key in response) {
            console.log(response[key].attributes.name);
        }
        $scope.foods = response;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    $scope.getFoodTime = function(d1) {
        return jQuery.timeago(d1);
    };

}]);
