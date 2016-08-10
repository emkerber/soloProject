// History Controller
angular.module('dingDogSwitchApp').controller('HistoryController', ['$http', function($http) {
  var vm = this; // controllerAs syntax is used

  vm.list = [];

  // displays complete notification history
  function displayList() {

    $http.get('/api/history').then(function(response) {

      vm.list = response.data.rows;
    });
  };

  // calls the function, so it displays when the view loads
  displayList();
}]);
