/**
 * Created by manel on 25/4/16.
 */
cities2.controller('professorCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$localStorage','$sessionStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $localStorage, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    $scope.idChat=null;
    //para poder desencriptar el mensaje en NODE con BIGNUM
    var String2bin= function (str) {
        var bytes = [];
        for (var i = 0; i < str.length; ++i) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    };
    var bin2String= function (array) {
        var result = "";
        for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(array[i]);
        }
        return result;
    };
    //recargar asignaturas para el usuario que se conecta
    $scope.cargaAsignaturas = function () {
        $rootScope.asignaturas=$localStorage.user.asignaturas;
        $http.get('/mensajes/getMensajes/'+$localStorage.user.nombre)
            .success(function (data) {
                if (data.respuesta.toString()==="no hay mensajes sin leer"){
                    $rootScope.mensajes="Tienes 0 mensajes nuevos";
                }
                else{
                    var msjRec = data.respuesta;
                    $rootScope.mensajesList=msjRec;
                    $rootScope.mensajes="Tienes "+msjRec.length+" mensajes sin leer";
                }
            })
            .error(function (data) {
            });
    };
    //obtener mensajes enviando a TTP el paso 4 de no repudio
    $scope.getMensajes = function () {
        var msjToTTP=[];
        var listaMensajes = $rootScope.mensajesList;
        var Pr;
        var PrCrip;
        $rootScope.mensajesList=[];
        $rootScope.mensajesNoLeidos=[];
        $rootScope.mensajesLeidos=[];
        $rootScope.mensajesEnviados=[];
        if (listaMensajes[0].toString()==="Tienes 0 mensajes nuevos")
        {
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
                                $http.post('/mensajes/compruebaMsg',msjRec[i]._id)
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

        }
        else{
            //Coger la privada de B para firmar Pr
            var KeyPrivB = $localStorage.privateKey;
            var KeyPubB = $localStorage.publicKey;
            var pubKeyB = new rsaMax.publicKey(KeyPubB.bits, new BigInteger(KeyPubB.n), new BigInteger(KeyPubB.e));
            var privKeyB = new rsaMax.privateKey(new BigInteger(KeyPrivB.p), new BigInteger(KeyPrivB.q), new BigInteger(KeyPrivB.d), pubKeyB);

            for (var i=0; i< listaMensajes.length;i++)
            {
                var trozos = listaMensajes[i].split("***");
                var ttp=trozos[0];
                var b=trozos[1];
                var a=trozos[2];
                var Po=trozos[3];
                Pr=b+"***"+ttp+"***"+a+"***"+Po;
                var PrHash=md5.createHash(Pr);
                var PrEncode= String2bin(PrHash);
                PrCrip = privKeyB.encrypt(new BigInteger(PrEncode)).toString();
                var PKA={
                    bits: pubKeyB.bits,
                    n: pubKeyB.n.toString(),
                    e: pubKeyB.e.toString()
                };
                var msj=b+"***"+ttp+"***"+a+"***"+Po+"***"+PrCrip+"***"+JSON.stringify(PKA);
                console.log(PrCrip);
                console.log(msjToTTP);
                msjToTTP.push(msj);
            }
            $http.post('/mensajes/getMensajesTotal/'+$localStorage.user.nombre, {mensaje:msjToTTP})
                .success(function (data) {
                    console.log(data);
                    var msjRec = data.respuesta;
                    $rootScope.mensajesList=msjRec;

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
        }

    };
    //recargar contenido de una asignatura (en la pagina de la asignatura)
    $scope.cargaAsignatura = function () {
        $scope.getSubjectChat($scope.subject);
    };
    //metemos en subject el parametro ID que viene cuando pulsamos en una asignatura
    $scope.subject=$stateParams.id;
    //función para obtener los chats de una asignatura (y sus usuarios también)
    $scope.getSubjectChat = function (id) {
        $http.get('/chats/getChats/'+id)
            .success(function (data) {
                $rootScope.chats=data.chats;
            })
            .error(function (data) {

            });
        $http.get('/server/getUsersByAsignatura/'+id)
            .success(function (data) {
                $rootScope.usuarios=data.usuarios;
            })
            .error(function (data) {

            })
    };
    //funcion para crear un nuevo chat
    $scope.crearChat = function (idChat) {
        if (idChat==null){
            console.log("Falta poner el nombre del chat");
            //alert("Falta poner tu nombre");
            sweetAlert(
                'Error',
                'Falta poner el nombre del chat',
                'error'
            )
        }
        else{
            var mensaje={
                nombre: idChat,
                creador: $localStorage.user.nombre,
                estado: "empezado",
                asignatura: $scope.subject,
                votacion: "No realizada",
                key: JSON.stringify($localStorage.pubPaillier)
            };
            console.log(mensaje);
            $http.post('/chats/addchat', mensaje)
                .success(function (data) {
                    console.log(data);
                    $rootScope.chats=data.chats;
                    $state.go("chat",{"id":$scope.subject});
                })
                .error(function (data) {

                });
        }
    };
    
}]);