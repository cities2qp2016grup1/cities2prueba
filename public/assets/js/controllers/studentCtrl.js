/**
 * Created by manel on 25/4/16.
 */
cities2.controller('studentCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage','$localStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage, $localStorage) {
    $rootScope.isLogged=true;
    $rootScope.salir=true;
    console.log($localStorage.user.asignaturas);
    //console.log($stateParams.data); no va, mirar en el futuro
    var refresh = function () {
        $rootScope.asignaturas=$localStorage.user.asignaturas;
    };
    refresh();
    $scope.subject=$stateParams.id;
}]);