cities2.controller('operacionesCtrl',['$scope', '$state','$http','$rootScope', '$localStorage', function($scope, $state, $http,$rootScope, $localStorage) {
    $scope.OperacionSuma = {};
    $scope.OperacionResta = {};
    $scope.OperacionMulti = {};
    $scope.OperacionDivi = {};
    $scope.sumar = function(OperacionSuma){
        var keys= rsaMax.generateKeys(1024);

        var bits = keys.publicKey.bits.toString();
        var n = keys.publicKey.n.toString();
        var e = keys.publicKey.e.toString();
        var pubKeyJSON={
            e:e,
            n:n,
            bits:bits
        };
        var p =keys.privateKey.p.toString();
        var q = keys.privateKey.q.toString();
        var d = keys.privateKey.d.toString();
        var privKeyJSON={
            p:p,
            q:q,
            d:d
        };
        var keysClient ={
            privada: JSON.stringify(privKeyJSON),
            publica: JSON.stringify(pubKeyJSON)
        };
        console.log("Clave publica recien generada" + keysClient.publica);

        var publicKey = new rsaMax.publicKey(pubKeyJSON.bits, new BigInteger(pubKeyJSON.n), new BigInteger(pubKeyJSON.e));
        var privateKey = new rsaMax.privateKey(new BigInteger(privKeyJSON.p), new BigInteger(privKeyJSON.q), new BigInteger(privKeyJSON.d), publicKey);
        console.log("Clace Publica con rsaMax: " + publicKey);
        
        var encA = publicKey.encrypt(nbv(OperacionSuma.num1.toString())).toString();
        var encB = publicKey.encrypt(nbv(OperacionSuma.num2.toString())).toString();
        console.log("Muestro los dos valores encriptados: "+ encA +"Hola"+ encB);

        var OperacionJson=
        {
            num1:encA,
            num2:encB
        };
        
        /*var serverPub = $localStorage.server;
        var publicKey = new rsaMax.publicKey(serverPub.bits, new BigInteger(serverPub.n), new BigInteger(serverPub.e));
        console.log(publicKey);
        var encA = publicKey.encrypt(nbv(OperacionSuma.num1.toString())).toString();
        var encB = publicKey.encrypt(nbv(OperacionSuma.num2.toString())).toString();
        
        var OperacionJson=
        {
            num1:encA,
            num2:encB
        };

        
       /* var keys = paillier.generateKeys(1024);
        var encA = keys.pub.encrypt(nbv(OperacionSuma.num1).mod(keys.pub.n));
        var encB = keys.pub.encrypt(nbv(OperacionSuma.num2).mod(keys.pub.n));
        var encAB = keys.pub.add(encA,encB);
        var plaintext = keys.sec.decrypt(encAB).mod(keys.pub.n).toString(10);

         console.log(plaintext);*/
         /*var reqdecrip2 = keys.privateKey.decrypt(num2).mod(keys.publicKey.n);
         var claro2 = reqdecrip2.toString(10);*/


        $http.post('/operaciones/sumar',OperacionJson)
            .success(function (data)
            {
                console.log("Intento mostrar la suma encriptada: " +  data);
                var decripsuma = privateKey.decrypt(nbv(data.toString())).toString();
                console.log("Intento mostrar la suma desencriptada: " + decripsuma);
                $scope.resultado3 = 'correcto';
                document.getElementById("resultadoSuma").innerHTML = (data);
            })
            .error(function (data) {
                $scope.resultado3 = 'incorrecto';
                console.log('Error: ' + data)
            });
    };
    $scope.restar = function(OperacionResta)
    {
        var serverPub = $localStorage.server;
        var publicKey = new rsaMax.publicKey(serverPub.bits, new BigInteger(serverPub.n), new BigInteger(serverPub.e));
        console.log(publicKey);

        var encA = publicKey.encrypt(nbv(OperacionResta.num1.toString())).toString();
        var encB = publicKey.encrypt(nbv(OperacionResta.num2.toString())).toString();
        var OperacionJson=
        {
            num1:encA,
            num2:encB
        };
        //console.log("Only for you:  " + encA);

        $http.post('/operaciones/restar',OperacionJson)
            .success(function (data) {
                $scope.resultado4 = 'correcto';
                document.getElementById("resultadoResta").innerHTML = (data);
            })
            .error(function (data) {
                $scope.resultado4 = 'incorrecto';
                console.log('Error: ' + data)
            });
    };
    $scope.multiplicar = function(Operacion3){
        $http.post('/operaciones/multiplicar',Operacion3)
            .success(function (data) {
                $scope.resultado5 = 'correcto';
                document.getElementById("resultadoMulti").innerHTML = (data);
            })
            .error(function (data) {
                $scope.resultado5 = 'incorrecto';
                console.log('Error: ' + data)
            });
    };
    $scope.dividir = function(Operacion4){
        $http.post('/operaciones/dividir',Operacion4)
            .success(function (data) {
                $scope.resultado6 = 'correcto';
                document.getElementById("resultadoDivi").innerHTML = (data);
            })
            .error(function (data) {
                $scope.resultado6 = 'incorrecto';
                console.log('Error: ' + data)
            });
    };
}]);