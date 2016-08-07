angular.module('dingDogSwitchApp').controller('MainController', function($http, $location) {
  var vm = this;

  // Displays five most recent notifications
  vm.listDate = [];
  vm.listText = [];

  function displayList() {
    $http.get('/api/main').then(function(response) {

      vm.listDate = response.data.rows;
      //
      // vm.listDate += response.data.rows[4].date;

      console.log(vm.listDate);
    });
  };

  displayList();

  // //
  // vm.textContent
  //
  // vm.update = function()
  //
  // vm.logout = function()
});
