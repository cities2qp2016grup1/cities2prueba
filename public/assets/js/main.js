
var cities2 = angular.module('cities2',[
    'ui.router',
    'ngRoute',
    'ngStorage',
    'angular-md5'
]);

cities2.config(function ($urlRouterProvider, $routeProvider, $stateProvider, $locationProvider) {
/*
    // Remove # from url
    $locationProvider.html5Mode(true);
*/

    // Set up the states
    /*
$routeProvider
    .when('/', {
        templateUrl: '/assets/views/indice.html',
        controller:'mainCtrl'
    })
    .when('/home', {
        templateUrl: '/assets/views/registrar.html',
        controller: 'userCtrl'
    })
    .when('/login', {
        templateUrl: '/assets/views/login.html',
        controller: 'userCtrl'
    })
    .when('/server', {
        templateUrl: '/assets/views/user.html',
        controller: 'userCtrl'
    })
    .when('/operaciones', {
        templateUrl: '/assets/views/operaciones.html',
        controller: 'operacionesCtrl'
    })
    .when('/about', {
        templateUrl: '/assets/views/about.html'
    })
    .when('/contact', {
        templateUrl: '/assets/views/contact.html'
    })
    .otherwise("/");
*/
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "assets/views/indice.html",
            controller: "mainCtrl"
        })
        .state('registrar', {
            url: "/home",
            templateUrl: "assets/views/registrar.html",
            controller: "userCtrl"
        })
        .state('server', {
            url: "/server",
            templateUrl: "assets/views/user.html",
            controller: "userCtrl"
        })
        .state('login', {
            url: "/login",
            templateUrl: "assets/views/login.html",
            controller: "userCtrl"
        })
        .state('operaciones', {
            url: "/operaciones",
            templateUrl: "assets/views/operaciones.html",
            controller: "operacionesCtrl"
        })
        .state('about', {
            url: "/about",
            templateUrl: "assets/views/about.html"
        })
        .state('contact', {
            url: "/contact",
            templateUrl: "assets/views/contact.html"
        })
        .state('Shome', {
            url: "/shome",
            templateUrl: "assets/views/studentHome.html",
            controller: "userCtrl"
        })
        .state('Phome', {
            url: "/phome",
            templateUrl: "assets/views/professorHome.html",
            controller: "userCtrl"
        })
})
    .run(function ($rootScope) {
        $rootScope.isLogged = false;
    });
