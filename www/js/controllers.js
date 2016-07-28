angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicPopup, $ionicPlatform) {

  $ionicPlatform.ready(function() {  

    $scope.clocked_in = false;
    $scope.time = 0;
    $scope.latLng = new google.maps.LatLng(0, 0);
    $scope.history = [];

    $scope.clockIn = function(){
      $scope.clocked_in = true;
    }

    $scope.clockOut = function(){
      $scope.clocked_in = false;
    }

  //Initialise the map and add a marker to current position
  var options = {timeout: 10000, enableHighAccuracy: true};

  var mapOptions = {
    center: $scope.latLng,
    zoom: 1,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


  google.maps.event.addListenerOnce($scope.map, 'idle', function(){

   $cordovaGeolocation.getCurrentPosition(options).then(function(position){ 

    $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: $scope.latLng
    });   

    $scope.map.setCenter($scope.latLng);
    $scope.map.setZoom(18);   

  }, function(error){
   $scope.showAlert('Cannot get location');

 },
 { timeout: 15000 });
 });

  // An alert dialog
  $scope.showAlert = function(error) {
   var alertPopup = $ionicPopup.alert({
     title: 'Error',
     template: error
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };

});

})

  .controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
