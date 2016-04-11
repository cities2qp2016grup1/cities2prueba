cities2.controller('userCtrl',['$scope', '$state','$http','md5', function($scope, $state, $http, md5) {
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
            console.log("1: A-->TTP: (TTP, B, M, Po)");
            var ttp="localhost:3000/ttp/adduser";
            var b="localhost:8000/server/adduser";
            var M=newUser;
            var Mhash=md5.createHash(JSON.stringify(M));
            var Po={
                ttp:ttp,
                b:b,
                Mhash:Mhash    //deberá ser el HASH de M
            };
            var mensaje ={
                ttp:ttp,
                b:b,
                M:M,
                Po:Po
            };
            $http.post('/ttp/adduser', mensaje)
                .success(function (data,data2) {
                    $scope.resultado = 'correcto'
                })
                .error(function (data, data2) {
                    $scope.resultado = 'incorrecto'
                })
        }
    };
    $scope.AllUsers = function(){
        console.log("1: A-->TTP: (TTP, B, M, Po)");
        var ttp="localhost:3000/ttp/allusers";
        var b="localhost:8000/server/allusers";
        var M="GET ALLUSERS";
        var Mhash=md5.createHash(M);
        var Po={
            ttp:ttp,
            b:b,
            Mhash:Mhash     //deberá ser el HASH de M
        };
        var mensaje ={
            ttp:ttp,
            b:b,
            M:M,
            Po:Po
        };
        $http.post('/ttp/allusers', mensaje)
            .success(function (data) {
                $scope.resultado2 = 'correcto';
                document.getElementById("datosUsers").innerHTML = JSON.stringify(data.body.data2, undefined, 2)
            })
            .error(function (data) {
                $scope.resultado2 = 'incorrecto';
                console.log('Error: ' + data.body.data2)
            });
    };
}]);