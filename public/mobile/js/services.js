SporkitServiceModule.service('Facebook', function($rootScope) {
    var Food = Parse.Object.extend("Trip");
    var foodQuery = new Parse.Query(Food);

    var ParseUser = Parse.Object.extend("User");
    var parseUserQuery = new Parse.Query(ParseUser);

    var createResponse = function(id, response) {
        if (response) {
            $rootScope.$broadcast(id + '-onsuccess', response);
        } else {
            $rootScope.$broadcast(id + '-onerror');
        }
    };

    return {
        currentLocationAddress0 : null,
        currentLocationAddress1 : null,
        currentUser : Parse.User.current(),
        userInfo : function() {
            FB.api("/me", function(response) {
                createResponse('fb-get-userinfo', response);
            });
        },
        getFriends : function() {
            FB.api('/me/friends', function(response) {
                createResponse('fb-get-friends', response);
            });
        },
        getAllFoods : function(user) {
            if (user) {
                foodQuery.equalTo("createdBy", user);
            }
            foodQuery.include("createdBy");
            foodQuery.find(function(response) {
                createResponse('get-all-foods', response);
            });
        },
        getAllParseUsers : function(user) {
            parseUserQuery.find(function(response) {
                createResponse('get-all-parseusers', response);
            });
        },
        getLoginStatus : function() {
            FB.getLoginStatus(function(response) {
                $rootScope.$broadcast('get-fb-login-status', response);
            });
        },
        callYelp : function(message) {
            /* Oauth */
            var auth = {
                //
                // Update with your auth tokens
                //
                consumerKey : "9GB9nOA1jN63P-jPvTcLqQ",
                consumerSecret : "16t3ghXM4BhudvqAqpXSVkjGZ-4",
                accessToken : "qEDfhPizldex7ZK23N0Uk-q2ZXmjNkYX",
                // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
                // You wouldn't actually want to expose your access token secret like this in a real application.
                accessTokenSecret : "yVJNbagUKtc2KDvEGpW7W9TlfTA",
                serviceProvider : {
                    signatureMethod : "HMAC-SHA1"
                }
            };

            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };

            parameters = [];
            parameters.push(['callback', 'cb']);
            parameters.push(['oauth_consumer_key', auth.consumerKey]);
            parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
            parameters.push(['oauth_token', auth.accessToken]);
            parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

            message.parameters = parameters;

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);

            var parameterMap = OAuth.getParameterMap(message.parameters);
            parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

            /* Oauth */
            $.ajax({
                'url' : message.action,
                'data' : parameterMap,
                'cache' : true,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
                'success' : function(data, textStats, XMLHttpRequest) {
                    $rootScope.$broadcast(message.callbackId + '-onsuccess', data);
                }
            });
        },
        getLocationFromLL : function(lat, lng) {
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, lng);
            geocoder.geocode({
                'latLng' : latlng
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log(results);
                    currentLocationAddress0 = results[0].formatted_address;
                    currentLocationAddress1 = results[1].formatted_address;
                    $rootScope.$broadcast('getLocationFromLL-onsuccess', results);
                    /*
                     if (results[1]) {
                     //formatted address
                     console.log(results[1].formatted_address);
                     //find country name
                     for (var i = 0; i < results[0].address_components.length; i++) {
                     for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                     //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                     if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                     //this is the object you are looking for
                     city = results[0].address_components[i];
                     break;
                     }
                     }
                     }
                     //city data
                     console.log(city.short_name + " " + city.long_name);
                     } else {
                     console.log("No results found");
                     }
                     */
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
            });
        },
        login : function() {
            Parse.FacebookUtils.logIn(null, {
                success : function(user) {
                    if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!");
                    } else {
                        console.log("User logged in through Facebook!");
                    }
                    $rootScope.$broadcast('fb-login-onsuccess');
                    FB.api("/me", function(response) {
                        if (!response.error) {
                            console.dir(response);
                            var currentUser = Parse.User.current();
                            currentUser.set("fbUserData", response);
                            currentUser.save();
                        }
                    });
                },
                error : function(user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                    $rootScope.$broadcast('fb-login-onerror');
                }
            });
        },
        logout : function() {
            FB.logout(function(response) {
                if (response) {
                    $rootScope.$broadcast('fb-logout-onsuccess');
                } else {
                    $rootScope.$broadcast('fb-logout-onerror');
                }
            });
        },
        unsubscribe : function() {
            FB.api("/me/permissions", "DELETE", function(response) {
                $rootScope.$broadcast('fb-unsubscribe-onresult', response);
            });
        }
    };
    return promise;
});

