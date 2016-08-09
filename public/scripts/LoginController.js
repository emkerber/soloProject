// Login Controller
angular.module('dingDogSwitchApp').controller('LoginController', function($http, $location) {
  var vm = this; // controllerAs syntax

  // these will be strings
  vm.phoneNumber = '';
  vm.password = '';

  // when the login button is clicked
  vm.login = function() {
    // console.log('Phone Number:', vm.phoneNumber);
    // console.log('Password', vm.password);

    var sendData = {};

    // send the data that's been entered on the page
    sendData.phonenumber = vm.phoneNumber;
    sendData.password = vm.password;

    $http.post('/login', sendData).then(handleSuccess, handleFailure);
  };

  function handleSuccess(response) {
    // console.log('Success posting login info', response);
    $location.path('/api/main'); // show user the main view
  };

  function handleFailure(response) {
    console.log('Failure posting login info', response);
    $location.path('/loginFail'); // show user the loginFail view
  };
});
