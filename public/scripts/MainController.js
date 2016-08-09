// Main Controller
angular.module('dingDogSwitchApp').controller('MainController', function($http, $timeout) {
  var vm = this; // controllerAs syntax

  // will display the five most recent notifications
  vm.list = [];

  // show the five most recent notifications on the DOM
  function displayList() {

    $http.get('/api/main').then(function(response) {

      vm.list = response.data.rows;
    });
  };

  // calls the function so the notifications are shown when the view loads
  displayList();

  // when the refresh button is clicked, $http.get the notifications again
  vm.refresh = function() {
    displayList();
  };

  // hide the <p> tag that tells the user they've updated the text content
  vm.updated = false;

  // sends updated text message content to the server
  vm.update = function() {

    var sendData = {};

    // send the data that was entered on the DOM
    sendData.textContent = vm.textContent;

    // console.log('var sendData inside vm.update function:', sendData);

    $http.post('/api/main', sendData).then(handleSuccess, handleFailure);
  };

  // show the <p> tag that tells the user they've updated the text content
  // hide the <p> tag after three seconds
  function handleSuccess(response) {
    // console.log('Success posting new text content', response);
    vm.updated = true;
    $timeout(function() { vm.updated = false; }, 3000);
  };

  function handleFailure(response) {
    console.log('Failure posting new text content', response);
  };
});
