angular.module('dingDogSwitchApp').controller('MainController', function($http) {
  var vm = this;

  // Displays five most recent notifications
  vm.list = [];

  function displayList() {

    $http.get('/api/main').then(function(response) {

      vm.list = response.data.rows;
    });
  };

  displayList();

  // Sends updated text message content to server-side
  vm.update = function() {

    // console.log('Click');

    var sendData = {};
    sendData.textContent = vm.textContent;

    // console.log('var sendData inside vm.update function:', sendData);

    $http.post('/api/main', sendData).then(handleSuccess, handleFailure);
  };

  function handleSuccess(response) {
    console.log('Success posting new text content', response);
    // alert('New text content successfully stored!');
  };

  function handleFailure(response) {
    console.log('Failure posting new text content', response);
  };

});
