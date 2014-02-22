SporkitControllerModule.controller('MyPlateController', ['$scope', 'Facebook',
function($scope, Facebook) {
    var Sporks = Parse.Object.extend("Spork");
    var currentUser = Parse.User.current();
    var Foods = Parse.Object.extend("Trip");

    Facebook.getAllFoods($scope.currentUser);

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




    $scope.messages = [];
    $scope.realtimeStatus = "Connecting...";
    $scope.channel = "pubnub_chat";
    $scope.limit = 20;

    //publish a chat message
    $scope.publish = function(){
        
        //toggle the progress bar
        $('#progress_bar').slideToggle();
        
         PUBNUB.publish({
                channel : $scope.channel,
                message : $scope.message
            }) ;
             
        //reset the message text
       $scope.message.text = "";
    };
        
    //gets the messages history   
    $scope.history = function(){
        PUBNUB.history( {
            channel : $scope.channel,
            limit   : $scope.limit
        }, function(messages) {
            // Shows All Messages
            $scope.$apply(function(){
                $scope.messages = messages.reverse();          
                
            }); 
        } );
     };
         

   //we'll leave these ones as is so that pubnub can
   //automagically trigger the events
   PUBNUB.subscribe({
        channel    : $scope.channel,
        restore    : false, 
    
        callback   : function(message) { 
            
            //toggle the progress_bar
            $('#progress_bar').slideToggle();         
         
            $scope.$apply(function(){
                $scope.messages.unshift(message);          
                
            }); 
        },
    
        disconnect : function() {   
            $scope.$apply(function(){
                $scope.realtimeStatus = 'Disconnected';
            });
        },
    
        reconnect  : function() {   
            $scope.$apply(function(){
                $scope.realtimeStatus = 'Connected';
            });
        },
    
        connect    : function() {  
            $scope.$apply(function(){
                $scope.realtimeStatus = 'Connected';
                //hide the progress bar
                $('#progress_bar').slideToggle();
                //load the message history from PubNub
                $scope.history();
            });
    
        }
    });



}]);
