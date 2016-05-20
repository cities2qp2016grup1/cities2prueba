cities2.controller('userCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$localStorage','$sessionStorage',  function($rootScope, $scope, $state, $stateParams, $http, md5, $localStorage, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=true;
    $scope.newUser = {};
    $scope.envioMessage = "vacío";
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
    //cargar el perfil de una persona
    $scope.cargaPerfil = function () {
        $http.get('/server/get/'+$stateParams.name)
            .success(function (data) {
                $rootScope.userProfile=data[0];
            })
            .error(function (data) {

            });
    };
    // Funcion para crear un usuario
    $scope.addUser = function (newUser) {
        if ((!newUser.email) && (!newUser.nombre) && (!newUser.rol) && (!newUser.password) && (!newUser.password2)){
            console.log("Falta rellenar campos");
            //window.confirm("Faltan muchos campos por rellenar"); ejemplo de confirm (para tenerlo)
            //prompt("Enter your name : ", "your name here"); ejemplo de prompt (para tenerlo)
            //alert("Faltan muchos campos por rellenar");
            sweetAlert(
                'Error',
                'Faltan muchos campos por rellenar',
                'error'
            )
        }
        else if (!newUser.nombre){
            console.log("Falta poner tu nombre");
            //alert("Falta poner tu nombre");
            sweetAlert(
                'Error',
                'Falta poner tu nombre',
                'error'
            )
        }
        else if (!newUser.email){
            console.log("Falta poner un email válido");
            //alert("Falta poner un email válido");
            sweetAlert(
                'Error',
                'Falta poner un email válido',
                'error'
            )
        }
        else if (!newUser.rol){
            console.log("Falta escoger un rol");
            //alert("Falta escoger un rol");
            sweetAlert(
                'Error',
                'Falta escoger un rol',
                'error'
            )
        }
        else if (!newUser.password){
            console.log("Falta tu contraseña");
            //alert("Falta tu contraseña");
            sweetAlert(
                'Error',
                'Falta tu contraseña',
                'error'
            )
        }
        else if (!newUser.password2){
            console.log("Falta repetir tu contraseña");
            //alert("Falta repetir tu contraseña");
            sweetAlert(
                'Error',
                'Falta repetir tu contraseña',
                'error'
            )
        }
        else if (newUser.asignaturas==null){
            console.log("Falta escoger almenos una asignatura");
            //alert("Falta escoger almenos una asignatura");
            sweetAlert(
                'Error',
                'Falta escoger almenos una asignatura',
                'error'
            )
        }
        else if (newUser.password!=newUser.password2){
            //alert("ATENCIÓN! Las contraseñas no coinciden");
            sweetAlert(
                'Error',
                'ATENCIÓN! Las contraseñas no coinciden',
                'error'
            )
        }
        else{
            console.log("Enviando nuevo usuario para registrar");
            var PwdHash=md5.createHash(JSON.stringify(newUser.password));
            //cliente genera sus claves privada y publica:
            var keys= rsaMax.generateKeys(1024);
            console.log("RSA Keys: "+keys.publicKey);

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
            //profesor genera sus claves de paillier
            var paillierkeys=paillier.generateKeys(1024);
            console.log("Paillier Keys: "+paillierkeys);
            var paillierPubJSON={
                bits: paillierkeys.pub.bits.toString(),
                n : paillierkeys.pub.n.toString(),
                n2 : paillierkeys.pub.n2.toString(),
                np1 : paillierkeys.pub.np1.toString(),
                rncache :paillierkeys.pub.rncache.toString()
            };
            var paillierPrivJSON={
                lambda : paillierkeys.sec.lambda.toString(),
                pubkey : paillierPubJSON.toString(),
                x : paillierkeys.sec.x.toString()
            };

            var keysClient ={
                privada: JSON.stringify(privKeyJSON),
                publica: JSON.stringify(pubKeyJSON),
                paillierPrivada: JSON.stringify(paillierPrivJSON),
                paillierPublica: JSON.stringify(paillierPubJSON)
            };
            $localStorage.privateKey = privKeyJSON;
            $localStorage.publicKey = pubKeyJSON;
            //encriptar claves publicas y privadas del cliente
            console.log(JSON.stringify(keysClient));
            var clientkeys = sjcl.encrypt(newUser.password, JSON.stringify(keysClient));
            var mensaje={
                nombre: newUser.nombre,
                email: newUser.email,
                rol: newUser.rol,
                password: PwdHash,
                keys: clientkeys,
                asignaturas: newUser.asignaturas
            };
            console.log(mensaje);
            $http.post('/server/adduser', mensaje)
                .success(function (data) {
                    $scope.resultado = 'correcto';
                    //alert("Te has registrado correctamente");
                    swal(
                        'Felicidades!',
                        'Te has registrado correctamente!',
                        'success'
                    );
                    $state.go("login");
                })
                .error(function (data) {
                    $scope.resultado = 'incorrecto';
                })
        }
    };
    $scope.logUser={};
    $scope.login = function (logUser) {
        if ((!logUser.email) && (!logUser.password)){
            sweetAlert(
                'Error',
                'Faltan campos por rellenar',
                'error'
            )
        }
        else if (!logUser.email){
            $scope.validaMail="incorrecto";
            sweetAlert(
                'Error',
                'Email incorrecto',
                'error'
            )
        }
        else if (!logUser.password){
            $scope.validaPassword="incorrecto";
            sweetAlert(
                'Error',
                'Falta por poner la contraseña',
                'error'
            )
        }
        else{
            console.log("Login Usuario");
            var PwdHash=md5.createHash(JSON.stringify(logUser.password));
            var mensaje={
                email: logUser.email,
                password: PwdHash
            };
            $http.post('/server/login', mensaje)
                .success(function (data) {
                    if (data.loginSuccessful==true){
                        $scope.MyRol=data.user.rol.toString();
                        //desencripta sus keys
                        var keysDecryp = sjcl.decrypt(logUser.password, data.user.keys);
                        var JSONkeys=JSON.parse(keysDecryp);
                        var priv=JSON.parse(JSONkeys.privada);
                        var pub= JSON.parse(JSONkeys.publica);
                        var paillierPriv =JSON.parse(JSONkeys.paillierPrivada);
                        var paillierPub=JSON.parse(JSONkeys.paillierPublica);

                        var bits = pub.bits.toString();
                        var n = pub.n.toString();
                        var e = pub.e.toString();
                        var pubKeyJSON={
                            e:e,
                            n:n,
                            bits:bits
                        };
                        var p =priv.p.toString();
                        var q = priv.q.toString();
                        var d = priv.d.toString();
                        var privKeyJSON={
                            p:p,
                            q:q,
                            d:d
                        };
                        var pubPaillierJSON={
                            bits: paillierPub.bits.toString(),
                            n : paillierPub.n.toString(),
                            n2 : paillierPub.n2.toString(),
                            np1 : paillierPub.np1.toString(),
                            rncache :paillierPub.rncache.toString()
                        };
                        var privPaillierJSON={
                            lambda : paillierPriv.lambda.toString(),
                            pubkey : pubPaillierJSON.toString(),
                            x : paillierPriv.x.toString()
                        };
                        $localStorage.privPaillier = privPaillierJSON;
                        $localStorage.pubPaillier = pubPaillierJSON;
                        $localStorage.privateKey = privKeyJSON;
                        $localStorage.publicKey = pubKeyJSON;
                        if ($scope.MyRol=="estudiante")
                        {
                            $localStorage.user=data.user;
                            $state.go('Shome');
                        }
                        else
                        {
                            $localStorage.user=data.user;
                            $state.go("Phome");
                        }
                    }
                    else {
                        sweetAlert(
                            'Error',
                            'La contraseña introducida es incorrecta',
                            'error'
                        )
                    }
                })
                .error(function (data) {
                    sweetAlert(
                        'Error',
                        'El usuario no existe',
                        'error'
                    )
                })
        }
    };
    $scope.sendMessage = function (envioMensaje) {
        console.log("1: A-->TTP: (TTP, B, M, Po)");
        // Create Base64 Object
        var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
        var ttp="localhost:3000/ttp/addmessage";
        var b="localhost:8000/server/addmessage";
        var M=envioMensaje; //encriptado con la publica de B
        var Mhash=md5.createHash(M);
        var Po=ttp+'*-*'+b+'*-*'+Mhash;
        var PoEncode= String2bin(Po);
        //firmando Po con privada de A
        var KeyPrivA = $localStorage.privateKey;
        var KeyPubA = $localStorage.publicKey;
        var pubKeyA = new rsaMax.publicKey(KeyPubA.bits, new BigInteger(KeyPubA.n), new BigInteger(KeyPubA.e));
        var privKeyA = new rsaMax.privateKey(new BigInteger(KeyPrivA.p), new BigInteger(KeyPrivA.q), new BigInteger(KeyPrivA.d), pubKeyA);
        var PoFirmado = {mensaje:privKeyA.encrypt(new BigInteger(PoEncode)).toString()};
        var PKA={
            bits: pubKeyA.bits,
            n: pubKeyA.n.toString(),
            e: pubKeyA.e.toString()
        };
        var mensaje= {mensaje:ttp+'***'+b+'***'+M+'***'+PoFirmado.mensaje+"***"+JSON.stringify(PKA)}; //encriptado con la publica de TTP
        //encriptando mensaje para TTP
        //var TTPPub = $localStorage.ttp;
        //var publicKeyTTP = new rsaMax.publicKey(TTPPub.bits, new BigInteger(TTPPub.n), new BigInteger(TTPPub.e));
        //var mensajeTTP = {mensaje:publicKeyTTP.encrypt(new BigInteger(mensaje)).toString()};

        $http.post('http://localhost:3000/ttp/addmessage', mensaje)
            .success(function (data) {
                console.log("Mensaje 2 recibido: "+ data.mensaje2);
                console.log("Mensaje 6 recibido: "+ data.mensaje6);
            })
            .error(function (data) {

            });
    };
}]);