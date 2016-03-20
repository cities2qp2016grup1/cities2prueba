cities2.controller('userCtrl',['$scope', '$state','$http', function($scope, $state, $http) {
    $scope.newUser = {};
    // Funcion para crear un usuario
    $scope.addUser = function (newUser) {
        $scope.hi();
        if ((!newUser.ciudad) && (!newUser.nombre)){
        }
        else if (!newUser.nombre){
        }
        else if (!newUser.ciudad){
        }
        else{
            $http.post('/ttp/adduser', newUser)
                .success(function (data) {
                    $scope.resultado = 'correcto'
                })
                .error(function (data) {
                    $scope.resultado = 'incorrecto'
                })
        }
    };



    $scope.AllUsers = function(){
        $scope.hi();
        $http.get('/ttp/allusers')
            .success(function (data) {
                $scope.resultado2 = 'correcto';
                document.getElementById("datosUsers").innerHTML = JSON.stringify(data, undefined, 2)
            })
            .error(function (data) {
                $scope.resultado2 = 'incorrecto';
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