/**
 * Created by manel on 25/4/16.
 */
cities2.controller('mensajesCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage','$localStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage, $localStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    $scope.ver=[];
    //recargar asignaturas para el usuario que se conecta
    $scope.cargaMensajes = function () {
        $http.get('/mensajes/getAllMensajes/'+$localStorage.user.nombre)
            .success(function (data) {
                if (data.respuesta.toString()==="no hay mensajes"){
                }
                else{
                    var msjRec = data.respuesta;
                    $rootScope.mensajesList=msjRec;
                    for (var i=0; i<msjRec.length; i++) {
                        if (msjRec[i].estado.toString() === "recibido") {
                            $rootScope.mensajesNoLeidos.push(msjRec[i]);
                        }
                        else if (msjRec[i].estado.toString() === "leido") {
                            $rootScope.mensajesLeidos.push(msjRec[i]);
                        }
                    }
                }
            })
            .error(function (data) {
            });
    };
    $scope.abrirMsg= function (id) {
        $http.post('/mensajes/leerMsg', {id:id})
            .success(function (data) {
                for (var i=0; i<$rootScope.mensajesNoLeidos.length; i++) {
                    if ($rootScope.mensajesNoLeidos[i]._id.toString() == id) {
                        $scope.ver=$rootScope.mensajesNoLeidos[i];
                        console.log($scope.ver);
                    }
                    else {
                        
                    }
                }
            })
            .error(function (data) {
            });
    };
}]);