angular.module('dingDogSwitchApp').controller('LoginController', function($http, $location) {
  var vm = this;

  vm.phoneNumber = '';
  vm.password = '';

  vm.login = function() {
    // console.log('Phone Number:', vm.phoneNumber);
    // console.log('Password', vm.password);

    var sendData = {};

    sendData.phoneNumber = vm.phoneNumber;
    sendData.password = vm.password;

    $http.post('/login', sendData).then(handleSuccess, handleFailure);
  };

  function handleSuccess(response) {
    console.log('Success posting login info', response);
    $location.path('/main');
  };

  function handleFailure(response) {
    console.log('Failure posting login info', response);
    $location.path('/loginFail');
  };
});
