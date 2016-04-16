cities2.controller('userCtrl',['$scope', '$state','$http','md5', 'paillier', function($scope, $state, $http, md5) {
    $scope.newUser = {};
    // Funcion para crear un usuario
    $scope.addUser = function (newUser) {
        if ((!newUser.ciudad) && (!newUser.nombre)){
        }
        else if (!newUser.nombre){
        }
        else if (!newUser.ciudad){
        }
        else{
            console.log("1: A-->TTP: (TTP, B, M, Po) + Lima");
            var ttp="localhost:3000/ttp/adduser";
            var b="localhost:8000/server/adduser";
            var M=newUser;
            var keys = paillier.generateKeys(512);
            console.log("This is it: " + keys)

            var Mhash=md5.createHash(JSON.stringify(M));
            var MhashEnc = keys.privateKey.encrypt(Mhash);

            var Po={
                ttp:ttp,
                b:b,
                Mhash:MhashEnc    //deberá ser el HASH de M
            };  //encriptado con la privada de A (Firmado)
            var mensaje ={
                ttp:ttp,
                b:b,
                M:M,    //encriptado con la publica de B
                Po:Po
            };
            var mensajeString = JSON.stringify(mensaje)
            var cleartext = new BUffer(mensajeString)
            var MensPreparado, MensEncr;
            MensPreparado = BigInteger(cleartext.toString('hex'), 16)
            MensEncr = keys.publicKey.encrypt(MensPreparado);

            //encriptado con la publica de TTP
            $http.post('/ttp/adduser', MensEncr)
                .success(function (data) {
                    $scope.resultado = 'correcto'
                })
                .error(function (data) {
                    $scope.resultado = 'incorrecto'
                })
        }
    };
    
    $scope.AllUsers = function(){
        console.log("1: A-->TTP: (TTP, B, M, Po)");
        console.log("Estoy aquí")
        var ttp="localhost:3000/ttp/allusers";
        var b="localhost:8000/server/allusers";
        var M="GET ALL USERS NOW";
        var keys = paillier.generateKeys(512);
        console.log("This is it: " + keys)
        var Mhash=md5.createHash(M);
        var MhashEnc = keys.privateKey.encrypt(Mhash);
        var MEnc = keys.publicKey.encrypt(M);
        var Po={
            ttp:ttp,
            b:b,
            Mhash:MhashEnc     //deberá ser el HASH de M encriptado con la privada de A (Firmado)
        };
        var mensaje ={
            ttp:ttp,
            b:b,
            M:MEnc,    //encriptado con la publica de B
            Po:Po
        };
        var mensajeString = JSON.stringify(mensaje)
        var cleartext = new BUffer(mensajeString)
        var MensPreparado, MensEncr;
        MensPreparado = BigInteger(cleartext.toString('hex'), 16)
        MensEncr = keys.publicKey.encrypt(MensPreparado);


        /* +  var x = JSON.stringify(Ps);
         +    var cleartext = new Buffer(x);
         +    var PsEn, EncryptedPs;
         +    PsEn = BigInt(cleartext.toString('hex'), 16);
         +    EncryptedPs = keys.publicKey.encrypt(PsEn);*/

        //encriptado con la publica de TTP
        $http.post('/ttp/allusers', MensEncr)
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