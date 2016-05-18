/**
 * Created by manel on 25/4/16.
 */
cities2.controller('professorCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$localStorage','$sessionStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $localStorage, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    $scope.idChat=null;
    //recargar asignaturas para el usuario que se conecta
    $scope.cargaAsignaturas = function () {
        $rootScope.asignaturas=$localStorage.user.asignaturas;
    };
    //recargar contenido de una asignatura (en la pagina de la asignatura)
    $scope.cargaAsignatura = function () {
        $scope.getSubjectChat($scope.subject);
    };
    //metemos en subject el parametro ID que viene cuando pulsamos en una asignatura
    $scope.subject=$stateParams.id;
    //función para obtener los chats de una asignatura (y sus usuarios también)
    $scope.getSubjectChat = function (id) {
        $http.get('/chats/getChats/'+id)
            .success(function (data) {
                $rootScope.chats=data.chats;
            })
            .error(function (data) {

            });
        $http.get('/server/getUsersByAsignatura/'+id)
            .success(function (data) {
                $rootScope.usuarios=data.usuarios;
            })
            .error(function (data) {

            })
    };
    //funcion para crear un nuevo chat
    $scope.crearChat = function (idChat) {
        if (idChat==null){
            console.log("Falta poner el nombre del chat");
            //alert("Falta poner tu nombre");
            sweetAlert(
                'Error',
                'Falta poner el nombre del chat',
                'error'
            )
        }
        else{
            var mensaje={
                nombre: idChat,
                creador: $localStorage.user.nombre,
                estado: "empezado",
                asignatura: $scope.subject,
                votacion: "No realizada",
                key: JSON.stringify($localStorage.pubPaillier)
            };
            console.log(mensaje);
            $http.post('/chats/addchat', mensaje)
                .success(function (data) {
                    console.log(data);
                    $rootScope.chats=data.chats;
                    $state.go("chat",{"id":$scope.subject});
                })
                .error(function (data) {

                });
        }
    }
}]);