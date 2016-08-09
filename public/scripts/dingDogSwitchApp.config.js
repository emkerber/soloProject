// configures AngularJS's ngRoutes for the dingDogSwitchApp module
angular.module('dingDogSwitchApp').config(function($routeProvider, $locationProvider) {

  // when the app is first loaded, the login page is shown
  $routeProvider.when('/', {
    templateUrl: '/views/login.html',
    controller: 'LoginController',
    controllerAs: 'login'
  })

  // contains an <a> tag link back to the login page, no Angular needed
  .when('/loginFail', {
    templateUrl: '/views/loginFail.html'
  })

  .when('/register', {
    templateUrl: '/views/register.html',
    controller: 'RegisterController',
    controllerAs: 'register'
  })

  // contains an <a> tag link back to the register page, no Angular needed
  .when('/registrationFail', {
    templateUrl: '/views/registrationFail.html'
  })

  // this view is behind /api for security purposes
  .when('/api/main', {
    templateUrl: 'views/main.html',
    controller: 'MainController',
    controllerAs: 'main'
  })

  // this view is behind /api for security purposes
  .when('/api/history', {
    templateUrl: 'views/history.html',
    controller: 'HistoryController',
    controllerAs: 'history'
  });

  // HTML5 conventions
  $locationProvider.html5Mode(true);
});
