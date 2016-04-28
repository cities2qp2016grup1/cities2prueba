/**
 * Created by manel on 25/4/16.
 */
cities2.controller('professorCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.salir=true;
    console.log($sessionStorage.user.asignaturas);
    //console.log($stateParams.data); no va, mirar en el futuro
    var refresh = function () {
        $rootScope.asignaturas=$sessionStorage.user.asignaturas;
    };
    refresh();
    $scope.subject=$stateParams.id;
}]);