// Initialize the Parse object first.
Parse.initialize("IWOnIOnfoZ9bVVxotiygJWUb12Tv6Bj2OCrYs8wI", "H1S0G8171I1BNIDOgrvxP25NbrDdQzSwbI8g8D86");

var SporkitApp = angular.module('SporkitApp', ['SporkitServiceModule', 'SporkitControllerModule', 'SporkitDirectiveModule']);

SporkitApp.directive('coolFade', function() {
    return {
      compile: function(elm) {
        //console.log('compiling');
        $(elm).css('opacity', 0);
        return function(scope, elm, attrs) {
         // console.log('animating');
          $(elm).animate({ opacity : 1.0 }, 1000 );
        };
      }
    };
  });

SporkitApp.run(function($rootScope) {
    window.fbAsyncInit = function() {
        //Once the Facebook JavaScript SDK is loaded, initialize FB and Parse.FacebookUtils

        Parse.FacebookUtils.init({
            appId : '457547424371583',
            status : true,
            cookie : true,
            xfbml : true
        });

        FB.getLoginStatus(function(response) {
            $rootScope.$broadcast('get-fb-login-status', response);
        });

    }; ( function(d) {
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));
});

SporkitApp.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : 'views/MyPlate.html'
    }).when('/myplate', {
        templateUrl : 'views/MyPlate.html'
    }).when('/takephoto', {
        templateUrl : 'views/TakePhoto.html'
    }).when('/search', {
        templateUrl : 'views/Search.html'
    }).when('/profile', {
        templateUrl : 'views/Profile.html'
    });
}); 

angular.element(document).ready(function(){
    angular.bootstrap($(document.body), ['SporkitApp']);
});
