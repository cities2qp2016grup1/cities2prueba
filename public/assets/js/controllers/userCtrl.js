cities2.controller('userCtrl',['$rootScope', '$scope', '$state','$http','md5','$sessionStorage',  function($rootScope, $scope, $state, $http, md5, $sessionStorage) {
    $rootScope.isLogged=true;
    $scope.newUser = {};
    // Funcion para crear un usuario
    $scope.addUser = function (newUser) {
        if ((!newUser.email) && (!newUser.nombre) && (!newUser.rol) && (!newUser.password) && (!newUser.password2)){
            console.log("Falta rellenar campos");
            //window.confirm("Faltan muchos campos por rellenar"); ejemplo de confirm (para tenerlo)
            //prompt("Enter your name : ", "your name here"); ejemplo de prompt (para tenerlo)
            alert("Faltan muchos campos por rellenar");
        }
        else if (!newUser.nombre){
            console.log("Falta poner tu nombre");
            alert("Falta poner tu nombre");
        }
        else if (!newUser.email){
            console.log("Falta poner un email válido");
            alert("Falta poner un email válido");
        }
        else if (!newUser.rol){
            console.log("Falta escoger un rol");
            alert("Falta escoger un rol");
        }
        else if (!newUser.password){
            console.log("Falta tu contraseña");
            alert("Falta tu contraseña");
        }
        else if (!newUser.password2){
            console.log("Falta repetir tu contraseña");
            alert("Falta repetir tu contraseña");
        }
        else if (newUser.asignaturas==null){
            console.log("Falta escoger almenos una asignatura");
            alert("Falta escoger almenos una asignatura");
        }
        else if (newUser.password!=newUser.password2){
            alert("ATENCIÓN! Las contraseñas no coinciden");
        }
        else{
            console.log("Enviando nuevo usuario para registrar");
            var PwdHash=md5.createHash(JSON.stringify(newUser.password));
            var mensaje={
                nombre: newUser.nombre,
                email: newUser.email,
                rol: newUser.rol,
                password: PwdHash,
                asignaturas: newUser.asignaturas
            };
            console.log(mensaje);
            $http.post('/ttp/adduser', mensaje)
                .success(function (data) {
                    $scope.resultado = 'correcto';
                    alert("Te has registrado correctamente");
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
                    if (data.loginSuccessful==true){
                        if ($scope.MyRol=="estudiante")
                        {
                            //$rootScope.asignaturas=data.user.asignaturas;
                            $sessionStorage.user=data.user;
                            $state.go('Shome');
                        }
                        else
                        {
                            //$rootScope.asignaturas=data.user.asignaturas;
                            $sessionStorage.user=data.user;
                            $state.go("Phome",{data:[data.user.asignaturas]});
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