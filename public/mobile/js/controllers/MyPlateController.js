SporkitControllerModule.controller('MyPlateController', ['$scope', 'Facebook',
function($scope, Facebook) {
    var Sporks = Parse.Object.extend("Spork");
    var currentUser = Parse.User.current();
    var Foods = Parse.Object.extend("Trip");

    Facebook.getAllFoods($scope.currentUser);

    $scope.getNoOfSporksForFood = function(food){
        
    };

    $scope.$on('get-all-foods-onsuccess', function(event, response) {
        $scope.foods = response;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    $scope.$on('get-all-parseusers-onsuccess', function(event, response) {
        for (var key in response) {
            console.log(response[key].attributes.name);
        }
        $scope.parseusers = response;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    $scope.getAllParseUsers = function(){
        Facebook.getAllParseUsers();
    };
   $scope.getAllParseUsers();
   
   $scope.$on('get-all-shoppingitems-onsuccess', function(event, response) {
        console.log(response[0].attributes.resultObj.searchresultgroups[0].products.product);
        $scope.shoppingitems = response[0].attributes.resultObj.searchresultgroups[0].products.product;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    $scope.getShoppingItems = function(searchTerm){
        Facebook.getShoppingItems(searchTerm);
    };
    $scope.getShoppingItems();
   
   
    $scope.getFoodTime = function(d1) {
        return jQuery.timeago(d1);
    };

    $scope.messages = [];
    $scope.realtimeStatus = "Connecting...";
    $scope.channel = "pubnub_chat";
    $scope.limit = 20;

    //publish a chat message
    $scope.publish = function(channelId){
        
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
