SporkitControllerModule.controller('SearchController', ['$scope', 'Facebook', 'Utils',
function($scope, Facebook, Utils) {
    var map;
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow();
    $scope.$on('search-restaurants-onsuccess', function(event, response) {
        console.log(response);
        $scope.nearByRestaurants = response;
        var restaurant_locations = [];
        for (var i = 0; i < $scope.nearByRestaurants.businesses.length; i++) {
            var loc = [];
            loc.push($scope.nearByRestaurants.businesses[i].name);
            loc.push($scope.nearByRestaurants.businesses[i].location.display_address[0] + ', ' + $scope.nearByRestaurants.businesses[i].location.display_address[1]);
            restaurant_locations.push(loc);
        };

        $scope.plotLocationsOnMap(restaurant_locations);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });
    $scope.plotLocationsOnMap = function(restaurant_locations) {
        for (var i = 0; i < restaurant_locations.length; i++) {
            codeAddresses(restaurant_locations[i]);
            
        }
    };

    function codeAddresses(arr) {
        geocoder.geocode({
            'address' : arr[1]
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                marker = new google.maps.Marker({
                    map : map,
                    position : results[0].geometry.location,
                    title : arr[0],
                    icon : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                });
                makeInfoWindowEvent(map, infowindow, arr[0], marker);
                //markersArray.push(marker);
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    function makeInfoWindowEvent(map, infowindow, contentString, marker) {
        google.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
    }


    $scope.isLoading = true;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
        $scope.isLoading = false;
    }

    function showPosition(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        latlon = new google.maps.LatLng(lat, lon);
        mapholder = document.getElementById('mapholder');
        mapholder.style.height = '250px';
        mapholder.style.width = '100%';

        var myOptions = {
            center : latlon,
            zoom : 16,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            mapTypeControl : false,
            navigationControlOptions : {
                style : google.maps.NavigationControlStyle.SMALL
            }
        };
        map = new google.maps.Map(document.getElementById("mapholder"), myOptions)
        var marker = new google.maps.Marker({
            position : latlon,
            map : map,
            title : "You are here!"
        });
        $scope.isLoading = false;

        Facebook.callYelp({
            'action' : 'http://api.yelp.com/v2/search?term=restaurant&ll=' + lat + ',' + lon,
            'method' : 'GET',
            'callbackId' : 'search-restaurants'
        });
        Facebook.getLocationFromLL(lat, lon);
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.");
                break;
        }
        $scope.isLoading = false;
    }


    $scope.$on('getLocationFromLL-onsuccess', function(event, response) {
        $scope.currentLocationAddress = response[0].formatted_address;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

}]);
