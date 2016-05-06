cities2.controller('operacionesCtrl',['$scope', '$state','$http','$rootScope', '$localStorage', function($scope, $state, $http,$rootScope, $localStorage) {
    $scope.OperacionSuma = {};
    $scope.OperacionResta = {};
    $scope.OperacionMulti = {};
    $scope.OperacionDivi = {};
    $scope.sumar = function(OperacionSuma){
         var keys = paillier.generateKeys(1024);
         var encA = keys.pub.encrypt(new BigInteger(OperacionSuma.num1.toString()).mod(keys.pub.n));
         var encB = keys.pub.encrypt(new BigInteger(OperacionSuma.num2.toString()).mod(keys.pub.n));
         var encryptedSum = keys.pub.add(encA,encB);
        console.log("Suma encriptada = " + encryptedSum);
         var sum = keys.sec.decrypt(encryptedSum);
         console.log("Suma= " + sum);

         var OperacionJson=
         {
            num1:encA.toString(),
            num2:encB.toString(),
            n2:keys.pub.n2.toString()
         };
        console.log(OperacionJson);

        $http.post('/operaciones/sumar',OperacionJson)
            .success(function (data)
            {
                console.log("Intento mostrar la suma encriptada: " +  data);
                var encriptedSum2 = new BigInteger(data.toString());
                console.log("Intento mostrar la suma encriptada: " +  encriptedSum2);
                var decripsuma = keys.sec.decrypt(encriptedSum2);
                console.log("Intento mostrar la suma desencriptada: " + decripsuma);
                $scope.resultado3 = 'correcto';
                document.getElementById("resultadoSuma").innerHTML = (decripsuma);
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