cities2.controller('userCtrl',['$rootScope', '$scope', '$state','$http','md5',  function($rootScope, $scope, $state, $http, md5) {
    $rootScope.isLogged=true;
    $scope.newUser = {};
    // Funcion para crear un usuario
    $scope.addUser = function (newUser) {
        if ((!newUser.email) && (!newUser.nombre) && (!newUser.rol) && (!newUser.password) && (!newUser.password2)){
        }
        else if (!newUser.nombre){
        }
        else if (!newUser.email){
        }
        else if (!newUser.rol){
        }
        else if (!newUser.password){
        }
        else if (!newUser.password2){
        }
        else if (newUser.password!=newUser.password2){
            $scope.alerts = [{
                type: 'danger',
                msg: 'Error los passwords no son iguales!'
            }];
        }
        else{
            console.log("Enviando nuevo usuario para registrar");
            var PwdHash=md5.createHash(JSON.stringify(newUser.password));
            var mensaje={
                nombre: newUser.nombre,
                email: newUser.email,
                rol: newUser.rol,
                password: PwdHash
            };
            $http.post('/ttp/adduser', mensaje)
                .success(function (data) {
                    $scope.resultado = 'correcto'
                })
                .error(function (data) {
                    $scope.resultado = 'incorrecto'
                })
        }
    };
    $scope.logUser={};
    $scope.login = function (logUser) {
        if ((!logUser.email) && (!logUser.password)){
        }
        else if (!logUser.email){
        }
        else if (!logUser.password){
        }
        else{
            console.log("Login Usuario");
            var PwdHash=md5.createHash(JSON.stringify(logUser.password));
            var mensaje={
                email: logUser.email,
                password: PwdHash
            };
            $http.post('/ttp/login', mensaje)
                .success(function (data) {
                    $scope.MyRol=data.user.rol.toString();
                    console.log($scope.MyRol);
                    if (data.loginSuccessful==true){
                        if ($scope.MyRol=="estudiante")
                        {
                            $rootScope.asignaturas=data.user.asignaturas;
                            $state.go("Shome");
                        }
                        else
                        {
                            $rootScope.asignaturas=data.user.asignaturas;
                            $state.go("Phome");
                        }
                    }
                    else {
                        $state.go("contact");
                    }
                })
                .error(function (data) {
                    
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
        $http.post('/ttp/allusers', mensaje)
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