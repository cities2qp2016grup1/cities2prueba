cities2.controller('operacionesCtrl',['$scope', '$state','$http','$rootScope', '$localStorage', function($scope, $state, $http,$rootScope, $localStorage) {
    $scope.OperacionSuma = {};
    $scope.OperacionResta = {};
    $scope.OperacionMulti = {};
    $scope.OperacionDivi = {};
    $scope.sumar = function(OperacionSuma){
        var keys = paillier.generateKeys(1024);
        var encA = keys.pub.encrypt(nbv(OperacionSuma.num1));
        var encB = keys.pub.encrypt(nbv(OperacionSuma.num2));
        var encAB = keys.pub.add(encA,encB);
        var plaintext = keys.sec.decrypt(encAB).toString(10);
        console.log(plaintext);
        $http.post('/ttp/sumar',OperacionSuma)
            .success(function (data) {
                $scope.resultado3 = 'correcto';
                document.getElementById("resultadoSuma").innerHTML = (plaintext);
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
        console.log("Only for you:  " + encA);
        

        $http.post('/ttp/restar',OperacionJson)
            .success(function (data) {
                $scope.resultado4 = 'correcto';
                document.getElementById("resultadoResta").innerHTML = (data);
            })
            .error(function (data) {
                $scope.resultado4 = 'incorrecto';
                console.log('Error: ' + data)
            });
    };

    /*
     router.post('/allusers', function (req, res) {
     var recibido = req.body;
     console.log(recibido);
     User.find(function (err, users) {
     if (err) res.send(500, err.message);
     // B desencripta el mensaje de TTP con la privada de B
     //cojo la privateKey de B
     var prikServer = JSON.parse(localStorage.getItem("Serverprivada"));
     var pubkServer = JSON.parse(localStorage.getItem("Serverpublica"));
     var keys ={};
     keys.publicKey= new rsa.publicKey(pubkServer.bits, bignum(pubkServer.n), bignum(pubkServer.e));
     keys.privateKey= new rsa.privateKey(bignum(prikServer.p), bignum(prikServer.q), bignum(prikServer.d), keys.publicKey);
     //console.log(keys);
     //encripto con la privada de B
     var recibidoBignum = bignum(req.body.mensaje);
     console.log(recibidoBignum);
     var reqdecrip = keys.privateKey.decrypt(recibidoBignum);
     var claro=reqdecrip.toBuffer().toString();
     console.log(claro);
     //  coje los datos necesarios para crear los mensajes
     var a="A";
     var ttp="localhost:3000/ttp/allusers";
     var L=users;  //mensaje de respuesta a A (encriptado con publica de A?)
     var Po=req.body.Po;
     var Pr={
     ttp:ttp,
     a:a,
     L:L,
     Po:Po
     }; //debera ir encriptado por la privada de B (firmar)
     var mensajeToTTP ={
     L:L,
     Pr:Pr
     }; //deberá ir encriptado con la publica de TTP
     console.log(mensajeToTTP);
     res.status(200).jsonp(mensajeToTTP);
     });
     */






    $scope.multiplicar = function(Operacion3){
        $http.post('/ttp/multiplicar',Operacion3)
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
        $http.post('/ttp/dividir',Operacion4)
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