angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicPopup, $ionicPlatform,  $localStorage) {

  $ionicPlatform.ready(function() {  

//Setup our scope variables
$scope.$storage = $localStorage;
$scope.position = { lat: 0, lng : 0};
$scope.logs = $localStorage.logs || [];
$scope.log = $localStorage.logs[0] || {};

    //Performs the clock in function
    $scope.clockIn = function(){
      $scope.log.start = {
        lat : $scope.position.lat,
        lng : $scope.position.lng,
        time : new Date(),
      }; 
      $scope.logs.push($scope.log); 
      $localStorage.logs = $scope.logs;    
    }

    //Clocks out current log and saves it to localStorage
    $scope.clockOut = function(){
      $scope.log.end = {
        lat : $scope.position.lat,
        lng : $scope.position.lng,
        time : new Date(),
      };
      $localStorage.logs = $scope.logs;
      $scope.log = {};

    }

    // Show alert dialog
    $scope.showAlert = function(error) {
     var alertPopup = $ionicPopup.alert({
       title: 'Error',
       template: error
     });
   };

   $scope.deleteLog = function(index){
    if($scope.logs[index] == $scope.log){
      $scope.log = {};
    }
    $scope.logs.splice(index, 1);
  }

  //Initialise the map and add a marker to current position
  var options = {timeout: 10000, enableHighAccuracy: true};

//Default map options
var mapOptions = {
  center: new google.maps.LatLng($scope.position),
  zoom: 1,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};

//Build the map
$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

//Once map is idle and ready
google.maps.event.addListenerOnce($scope.map, 'idle', function(){

//Get the users location
$cordovaGeolocation.getCurrentPosition(options).then(function(position){ 

  //Set these coordinates to scope variables
  $scope.position.lat = position.coords.latitude;
  $scope.position.lng = position.coords.longitude;

  //Make a new map latLng object with the users coords
  var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

//Make a map marker using users coords
var marker = new google.maps.Marker({
  map: $scope.map,
  animation: google.maps.Animation.DROP,
  position: latLng
});   

//Center and zoom in on the marker
$scope.map.setCenter(latLng);
$scope.map.setZoom(18);  

}, function(error){
  //Tell the user we cannot get their location
  $scope.showAlert('Cannot get location');
},{ timeout: 15000 });

});
});

})

.controller('HistoryCtrl', function($scope, $localStorage) {
  //Get the logs from the localStorage
  $scope.logs = $localStorage.logs || [];
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
