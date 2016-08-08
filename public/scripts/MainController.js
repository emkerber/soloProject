angular.module('dingDogSwitchApp').controller('MainController', function($http) {
  var vm = this;

  vm.updated = false;
  // Displays five most recent notifications
  vm.list = [];

  function displayList() {

    $http.get('/api/main').then(function(response) {

      vm.list = response.data.rows;
    });
  };

  displayList();


  vm.refresh = function() {
    displayList();
  };


  // Sends updated text message content to server-side
  vm.update = function() {

    // console.log('Click');

    var sendData = {};
    sendData.textContent = vm.textContent;

    // console.log('var sendData inside vm.update function:', sendData);
    // vm.updated = true;
    $http.post('/api/main', sendData).then(handleSuccess, handleFailure);
  };

  function handleSuccess(response) {
    console.log('Success posting new text content', response);
    vm.updated = true;
  };

  function handleFailure(response) {
    console.log('Failure posting new text content', response);
  };

});
