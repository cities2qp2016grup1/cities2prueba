cities2.controller('operacionesCtrl',['$scope', '$state','$http','$rootScope', function($scope, $state, $http,$rootScope) {
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
    $scope.restar = function(OperacionResta){
        $http.post('/ttp/restar',OperacionResta)
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