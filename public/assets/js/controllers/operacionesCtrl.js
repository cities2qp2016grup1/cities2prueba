cities2.controller('operacionesCtrl',['$scope', '$state','$http','$rootScope', function($scope, $state, $http,$rootScope) {
    $scope.OperacionSuma = {};
    $scope.OperacionResta = {};
    $scope.OperacionMulti = {};
    $scope.OperacionDivi = {};
    $scope.sumar = function(OperacionSuma){
        $scope.hi();
        $http.post('/ttp/sumar',OperacionSuma)
            .success(function (data) {
                $scope.resultado3 = 'correcto';
                document.getElementById("resultadoSuma").innerHTML = (data);
            })
            .error(function (data) {
                $scope.resultado3 = 'incorrecto';
                console.log('Error: ' + data)
            });
    };
    $scope.restar = function(OperacionResta){
        $scope.hi();
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
        $scope.hi();
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
        $scope.hi();
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
    $scope.hi = function(){
        $http.get('/ttp/hi')
            .success(function(data){
                $scope.resultado7 = 'correcto';
                console.log("Cliente contestado: "+data);
            })
            .error(function (data) {
                $scope.resultado7 = 'incorrecto';
                console.log('Error: ' + data)
            });
    }
}]);