/**
 * Created by manel on 25/4/16.
 */
cities2.controller('studentCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage','$localStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage, $localStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    $scope.voto="";
    $scope.chatAVotar="";
    $scope.message = 'Formulario para añadir clave compartida';
    $scope.CiegaFirmada="";
    $scope.r=0;
    $scope.blindPriv={};
    $scope.blindPub={};
    //////////Parte SSS
    $scope.secreto = '';
    $scope.secretoHex = '';
    $scope.n = ''; //nº shares
    $scope.t = ''; //threshold
    $scope.shares = '';
    $scope.share = '';
    $scope.message = 'Formulario para añadir los "shares"';
    //////////Parte SSS
    $scope.comb = '';
    $scope.secreto = '';
    $scope.secretoHex = '';
    $scope.n = ''; //nº shares
    $scope.t = ''; //threshold
    $scope.shares = [];
    $scope.share = '';
    $scope.s0 = '';
    $scope.s1 = '';
    $scope.s2 = '';
    //recargar lista de asignaturas para el usuario que se conecta (en el Home)
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
            })
    };
    //obtener mensajes enviando a TTP el paso 4 de no repudio
    $scope.getMensajes = function () {
        var msjToTTP=[];
        var listaMensajes = $rootScope.mensajesList;
        var Pr;
        var PrCrip;
        if (listaMensajes[0].toString()==="Tienes 0 mensajes nuevos")
        {
            $http.get('/mensajes/getAllMensajes/'+$localStorage.user.nombre)
                .success(function (data) {
                    if (data.respuesta.toString()==="no hay mensajes"){
                    }
                    else{
                        var msjRec = data.respuesta;
                        $rootScope.mensajesList=msjRec;
                        $rootScope.mensajesNoLeidos.length=0;
                        $rootScope.mensajesLeidos.length=0;
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
                });        }
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
                PrCrip = privKeyB.encrypt(new BigInteger(PrHash)).toString();
                var msj=b+"***"+ttp+"***"+a+"***"+Po+"***"+PrCrip;
                console.log(PrCrip);
                console.log(msjToTTP);
                msjToTTP.push(msj);
            }
            $http.post('/mensajes/getMensajesTotal/'+$localStorage.user.nombre, {mensaje:msjToTTP})
                .success(function (data) {
                    console.log(data);
                    var msjRec = JSON.parse(data.respuesta);
                    $rootScope.mensajesList=msjRec;
                    $rootScope.mensajes="Tienes "+msjRec.length+" mensajes sin leer";

                })
                .error(function (data) {
                })
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
        console.log("Obtener Chats de: "+id);
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

            });
    };


    $scope.registrar = function() {

        console.log('\nSecreto Compartido - Shamir\n');
        //var secreto = 'supersecerto';
        //Convierte el texto del secreto a hexadecimal
        $scope.secretoHex = secrets.str2hex($scope.secreto); // => 240-bit
        // Genera secreto aleatorio de 512-bit en hexadecimal
        //var secreto = secrets.random(1024);
        var n = parseInt($scope.n);
        var t = parseInt($scope.t);
        var i = 0;
        console.log('-Secreto:', $scope.secreto);
        console.log('-Secreto en hexa:', $scope.secretoHex);
        console.log('-Número de shares:', $scope.n);
        console.log('-Umbral de cooperación:', $scope.t);

        // Divide el secreto en "n" shares, con un umbral de "t" shares para descifrarlo, añadiendo zero-padding si los shares no llegan a 1024 bits
        $scope.shares = secrets.share($scope.secretoHex, n, t, 1024); // => 1024-bit shares
        //Muestra por consola  todos los shares
        while (i < $scope.n) {
            console.log('Share', i, ':', $scope.shares[i]);
            i++;
        }
    };


    $scope.addShare = function () {
        console.log($scope.share);
        $scope.shares.push($scope.share);
        console.log($scope.shares);
        $scope.share = "";
    };


    $scope.combine = function () {

        console.log('\n Recuperar Secreto Compartido \n');

        // Combina los shares (mínimo de "t" para conseguir descifrar el secreto)
        //$scope.comb = secrets.combine( [ $scope.s0, $scope.s1, $scope.s2 ] );
        // Combina toods los shares
        $scope.comb = secrets.combine($scope.shares);
        // Combina "x" shares seguidos
        //var comb = secrets.combine($scope.shares.slice(2, 6));

        // Convierte de nuevo a UTF
        $scope.comb = secrets.hex2str($scope.comb);

        console.log('\nCombinación de los shares:', $scope.comb);
        console.log('Descifrado correctamente:', $scope.comb === $scope.secreto); // => true / false

        $scope.supported = false;
    };

    $scope.getBlindEncryption =function (votaChat) {
        $scope.chatAVotar=votaChat;
        /*Generamos Clave Publica y Privada del Cliente*/
        var keys= rsaMax.generateKeys(1024);
        var pubKeyJSON={
            e:keys.publicKey.e.toString(),
            n:keys.publicKey.n.toString(),
            bits:keys.publicKey.bits.toString()
        };
        var privKeyJSON={
            p:keys.privateKey.p.toString(),
            q:keys.privateKey.q.toString(),
            d:keys.privateKey.d.toString()
        };
        $scope.blindPriv=privKeyJSON;
        $scope.blindPub=pubKeyJSON;
        /*Generation of blinding factor*/
        //   var r = Math.floor(Math.random()*65537)+1;
        //   console.log("Factor de cegado: " + r);
        var r = new BigInteger(keys.publicKey.bits,1,new SecureRandom());
        $scope.r=r;
        console.log("Factor de cegado: " + r);
        /*Multiplication of blinding factor by Publi Key*/
        var pubKey = new BigInteger(JSON.stringify(pubKeyJSON));

        var blindMsg = pubKey.multiply(r.modPow(keys.publicKey.e, keys.publicKey.n)).mod(keys.publicKey.n);
        console.log("Public Key multiplied by r^eT mod nT " + blindMsg);
        var msg={
            mensaje: blindMsg.toString()
        };
        $http.post('http://localhost:3000/ttp/firma', msg)
            .success(function (data) {
                console.log("Kpub ciega firmada por TTP: "+data.mensaje);
                $scope.CiegaFirmada=data.mensaje;
            })
            .error(function (data) {
            })
    };
    $scope.votar = function (voto) {
        console.log($scope.chatAVotar);
        console.log($scope.voto);
        console.log($scope.r);
        //var c = $scope.CiegaFirmada.multiply($scope.r.modInverse.mod($scope.blindPub.n);/****NO funciona***/

        //BigInteger s = ((one.divide(r)).multiply(bs)).mod(n);BigInteger s = r.modInverse(n).multiply(bs).mod(n);

        var s = new BigInteger($scope.r.modInverse($scope.blindPub.n).multiply($scope.CiegaFirmada).mod($scope.blindPub.n));/**Esta es la que mejor pinta tiene creo que tengo que seguir probando**/
        //var c = $scope.CiegaFirmada.multiply($scope.r.modInverse.mod($scope.blindPub.n);
        console.log('(unblinded) valid encryption    *1/r mod n:', '\n', s.toString(10), '\n');

        //Coger la privada NUEVA del cliente para firmar el voto
        var KeyPrivB = $localStorage.blindPriv;
        var KeyPubB = $localStorage.blindPub;
        var pubKeyB = new rsaMax.publicKey(KeyPubB.bits, new BigInteger(KeyPubB.n), new BigInteger(KeyPubB.e));
        var privKeyB = new rsaMax.privateKey(new BigInteger(KeyPrivB.p), new BigInteger(KeyPrivB.q), new BigInteger(KeyPrivB.d), pubKeyB);
        var votoFirmado = privKeyB.encrypt(new BigInteger(voto)).toString();
        var envioVoto = {
            voto: votoFirmado,
            kpub: s
        };
        $http.post('/server/votar', envioVoto)
            .success(function (data) {

            })
            .error(function (data) {
            })
    }
}]);