// Register Controller
angular.module('dingDogSwitchApp').controller('RegisterController', function($http, $location) {
  var vm = this; // controllerAs syntax

  // these will all be strings
  vm.phoneNumber = '';
  vm.passwordFirst = '';
  vm.passwordSecond = '';

  // when the register button is clicked
  vm.register = function() {

    // console.log('Phone Number:', vm.phoneNumber);

    var sendData = {};

    // send the data that's been entered on the DOM
    sendData.phoneNumber = vm.phoneNumber;
    sendData.passwordFirst = vm.passwordFirst;
    sendData.passwordSecond = vm.passwordSecond;

    $http.post('/register', sendData).then(handleSuccess, handleFailure);
  };

  function handleSuccess(response) {
    // console.log('Success posting registration info', response);
    $location.path('/'); // show the login view
  };

  function handleFailure(response) {
    console.log('Failure posting registration info', response);
    $location.path('/registrationFail'); // show the registrationFail view
  };
});
