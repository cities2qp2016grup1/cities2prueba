/**
 * Created by manel on 25/4/16.
 */
cities2.controller('professorCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$localStorage','$sessionStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $localStorage, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    console.log($localStorage.user.asignaturas);
    //console.log($stateParams.data); no va, mirar en el futuro
    var refresh = function () {
        $rootScope.asignaturas=$localStorage.user.asignaturas;
    };
    refresh();
    $scope.subject=$stateParams.id;
}]);