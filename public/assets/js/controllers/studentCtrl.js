/**
 * Created by manel on 25/4/16.
 */
cities2.controller('studentCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage','$localStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage, $localStorage) {
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
    
    $scope.getSubjectChat = function (id) {
        console.log("Obtener Chats de: "+id);
        $http.get('/chats/'+id)
            .success(function (data) {
                console.log(data);
                $rootScope.chats=data.chats;
            })
            .error(function (data) {

            })
    };
}]);