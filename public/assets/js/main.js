
var cities2 = angular.module('cities2',[
    'ui.router',
    'ngRoute',
    'angularLocalStorage'
]);

cities2.config(function ($routeProvider, $stateProvider) {
    // Set up the states

$routeProvider
    .when('/', {
        templateUrl: '/assets/views/indice.html',
        controller:'mainCtrl'
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
    .otherwise("/")
});
/*
    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "/public/index.html"
        })
        .state('index.server', {
            url: "/server",
            templateUrl: "/public/assets/views/user.html",
            controller: 'userCtrl'
        })
});
 */