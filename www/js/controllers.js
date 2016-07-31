angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicPopup, $ionicPlatform,  $localStorage) {
    //Setup our scope variables
    $scope.$storage = $localStorage;
    $scope.position = { lat: 0, lng : 0};
    $scope.logs = $localStorage.logs || [];
    $scope.log = {};

    if($scope.logs[$scope.logs.length -1]){
      if(! $scope.logs[$scope.logs.length -1].end){
        $scope.log = $scope.logs[$scope.logs.length -1];
      }
    }

  //Performs the clock in function
  $scope.clockIn = function(){
    $scope.log.start = {
      job : $scope.job,
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
        job : $scope.job,
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
   }

   $scope.initMap = function(){
    //Default map options
    var mapOptions = {
      center: new google.maps.LatLng($scope.position),
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
//Build the map
$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

//Watch the users location
$scope.watchPosition = function(){
  console.log('Getting current position...');
  $cordovaGeolocation.getCurrentPosition({ timeout: 5000, enableHighAccuracy: true }).then($scope.positionSuccess, $scope.positionError);
  console.log('Watching position...');
  var watch = $cordovaGeolocation.watchPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
  watch.then($scope.positionError, $scope.positionSuccess);
}

$scope.positionSuccess = function(position){
  console.log('Position available, watching...')
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
  };

  $scope.positionError = function(error){
    console.error('Posiiton unavailable');
    $scope.showAlert('Cannot get location');
  };

  //Device is ready...
  $ionicPlatform.ready(function() {
    //Initialise map
    $scope.initMap();

    //Once map is idle and ready
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
  //Start watching position once map is ready
  console.log('Map ready');  
  $scope.watchPosition();  
});
  });

})

.controller('HistoryCtrl', function($scope, $localStorage) {
  //Get the logs from the localStorage
  $scope.logs = $localStorage.logs || [];

  //Deletes a log from the storage and $scope.logs
  $scope.deleteLog = function(index){
    if($scope.logs[index] == $scope.log){
      $scope.log = {};
    }
    $scope.logs.splice(index, 1);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
