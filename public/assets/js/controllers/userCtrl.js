cities2.controller('userCtrl',['$rootScope', '$scope', '$state','$http','md5','$localStorage','$sessionStorage',  function($rootScope, $scope, $state, $http, md5, $localStorage, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=true;
    $scope.newUser = {};
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
            $scope.validaMail="incorrecto"
        }
        else if (!logUser.password){
            $scope.validaPassword="incorrecto"
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
                        console.log(paillierPriv);
                        console.log(paillierPub);

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
    $scope.AllUsers = function(){
        console.log("1: A-->TTP: (TTP, B, M, Po)");
        var ttp="localhost:3000/ttp/allusers";
        var b="localhost:8000/server/allusers";
        var M="GET ALL USERS"; //encriptado con la publica de B
        var Mhash=md5.createHash(M);
        var PoJSON={
            ttp:ttp,
            b:b,
            Mhash:Mhash     //deberá ser el HASH de M
        };
        var Po=PoJSON.ttp+','+PoJSON.b+','+PoJSON.Mhash;    //encriptado con la privada de A (Firmado)
        var mensajeJSON ={
            ttp:ttp,
            b:b,
            M:M,
            Po:Po
        };
        var mensaje= {mensaje:mensajeJSON.ttp+','+mensajeJSON.b+','+mensajeJSON.M+','+Po}; //encriptado con la publica de TTP
        $http.post('http://localhost:3000/ttp/allusers', mensaje)
            .success(function (data) {
                $scope.resultado2 = 'correcto';
                document.getElementById("datosUsers").innerHTML = JSON.stringify(data.data2.L, undefined, 2)
            })
            .error(function (data) {
                $scope.resultado2 = 'incorrecto';
                console.log('Error: ' + data)
            });
    };
}]);