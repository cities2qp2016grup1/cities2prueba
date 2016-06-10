/**
 * Created by manel on 25/4/16.
 */
cities2.controller('mensajesCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage','$localStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage, $localStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    //recargar asignaturas para el usuario que se conecta
    $scope.cargaMensajes = function () {
        $http.get('/mensajes/getAllMensajes/'+$localStorage.user.nombre)
            .success(function (data) {
                if (data.respuesta.toString()==="no hay mensajes"){
                }
                else{
                    var msjRec = data.respuesta;
                    $rootScope.mensajesList=msjRec;
                    console.log($rootScope.mensajesList);
                    console.log(msjRec[0]);
                    console.log(msjRec[0].estado.toString());
                    for (var i=0; i<msjRec.length; i++) {
                        if (msjRec[i].estado.toString() === "recibido") {
                            $rootScope.mensajesNoLeidos.push(msjRec[i]);
                            console.log($rootScope.mensajesNoLeidos);
                        }
                        else if (msjRec[i].estado.toString() === "leido") {
                            $rootScope.mensajesLeidos.push(msjRec[i]);
                            console.log($rootScope.mensajesLeidos);
                        }
                    }
                }
            })
            .error(function (data) {
            });
    };
    $scope.abrirMsg= function () {
        $http.post('/mensajes/leerMsg/'+$localStorage.user.nombre)
    };
}]);