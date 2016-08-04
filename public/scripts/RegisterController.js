angular.module('dingDogSwitchApp').controller('RegisterController', function($http, $location) {
  var vm = this;

  vm.phoneNumber = '';
  vm.passwordFirst = '';
  vm.passwordSecond = '';

  vm.register = function() {
    // console.log('Phone Number:', vm.phoneNumber);
    // console.log('Password', vm.passwordFirst);
    // console.log('Confirm password', vm.passwordSecond);

    var sendData = {};

    sendData.phoneNumber = vm.phoneNumber;
    sendData.passwordFirst = vm.passwordFirst;
    sendData.passwordSecond = vm.passwordSecond;

    $http.post('/register', sendData).then(handleSuccess, handleFailure);
  };

  function handleSuccess(response) {
    console.log('Success posting registration info', response);
    $location.path('/');
  };

  function handleFailure(response) {
    console.log('Failure posting registration info', response);
    $location.path('/registrationFail');
  };
});
