/**
 * Created by manel on 25/4/16.
 */
cities2.controller('mensajesCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage','$localStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage, $localStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    //recargar asignaturas para el usuario que se conecta
    $scope.cargaMensajes = function () {
        $rootScope.mensajesList=[];
        $rootScope.mensajesNoLeidos=[];
        $rootScope.mensajesLeidos=[];
        $rootScope.mensajesEnviados=[];
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
                            $http.post('/mensajes/compruebaMsg',{id:msjRec[i]._id})
                                .success(function (data) {
                                    
                                })
                                .error(function (data) {
                                    
                                });
                        }
                        else if (msjRec[i].estado.toString() === "leido") {
                            $rootScope.mensajesLeidos.push(msjRec[i]);
                        }
                    }
                }
            })
            .error(function (data) {
            });
        $http.get('/mensajes/getMensajesEnviados/'+$localStorage.user.nombre)
            .success(function (data) {
                if (data.respuesta.toString()==="no hay mensajes"){
                }
                else{
                    var msjRecib = data.respuesta;
                    $rootScope.mensajesEnviados=msjRecib;
                }
            })
            .error(function (data) {
            });
    };
    $scope.abrirMsg= function (id) {
        $http.post('/mensajes/leerMsg', {id:id})
            .success(function (data) {
                for (var i=0; i<$rootScope.mensajesNoLeidos.length; i++) {
                    if ($rootScope.mensajesNoLeidos[i]._id == id) {
                        $rootScope.ver=$rootScope.mensajesNoLeidos[i];
                        console.log($rootScope.ver);
                    }
                    else {
                        
                    }
                }
            })
            .error(function (data) {
            });
    };
    $scope.leerMsg= function (id) {
        for (var i=0; i<$rootScope.mensajesLeidos.length; i++) {
            if ($rootScope.mensajesLeidos[i]._id == id) {
                $rootScope.ver=$rootScope.mensajesLeidos[i];
                console.log($rootScope.ver);
            }
            else {

            }
        }
            
            
    };
}]);