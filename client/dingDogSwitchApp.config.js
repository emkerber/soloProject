angular.module('dingDogSwitchApp').config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '/views/login.html',
    controller: 'LoginController',
    controllerAs: 'login'
  })

  .when('/loginFail', {
    templateUrl: '/views/loginFail.html'
  })

  .when('/register', {
    templateUrl: '/views/register.html',
    controller: 'RegisterController',
    controllerAs: 'register'
  })

  .when('/registrationFail', {
    templateUrl: '/views/registrationFail.html'
  }),

  $locationProvider.html5Mode(true)
};
