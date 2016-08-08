angular.module('dingDogSwitchApp').controller('HistoryController', function($http) {
  var vm = this;

  // Displays complete notification history
  vm.list = [];

  function displayList() {

    $http.get('/api/history').then(function(response) {

      vm.list = response.data.rows;
    });
  };

  displayList();

});
