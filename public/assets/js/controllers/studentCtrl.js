/**
 * Created by manel on 25/4/16.
 */
cities2.controller('studentCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage) {
    $rootScope.isLogged=true;
    console.log($sessionStorage.asignaturas);
    //console.log($stateParams.data); no va, mirar en el futuro
    var refresh = function () {
        $rootScope.asignaturas=$sessionStorage.asignaturas;
    };
    refresh();
}]);