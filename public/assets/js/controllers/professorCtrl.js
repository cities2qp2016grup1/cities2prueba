/**
 * Created by manel on 25/4/16.
 */
cities2.controller('professorCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$localStorage','$sessionStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $localStorage, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    $scope.idChat=null;
    //console.log($stateParams.data); no va, mirar en el futuro
    var refresh = function () {
        $rootScope.asignaturas=$localStorage.user.asignaturas;
    };
    refresh();
    $scope.subject=$stateParams.id;
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