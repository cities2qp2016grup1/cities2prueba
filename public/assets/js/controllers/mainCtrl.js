/**
 * Created by manel on 12/3/16.
 */
cities2.controller
('mainCtrl',
    ['$rootScope', '$scope', '$state','$http','$localStorage','$sessionStorage',
        function($rootScope, $scope, $state, $http, $localStorage, $sessionStorage)
        {
            $rootScope.isLogged=false;
            $rootScope.salir=false;
            if ($localStorage.user==null)
            {
                console.log("Hola nuevo usuario, registrate o logueate");
            }
            else
            {
                console.log("Bienvenido de nuevo, "+$localStorage.user.nombre);
                if ($localStorage.user.rol=="estudiante")
                {
                    $state.go("Shome");
                }
                else
                {
                    $state.go("Phome");
                }
            }
            $scope.init = function ()
            {
                $http.get('http://localhost:8000/key/server').success(function (data)
                {
                    $localStorage.server = data;
                }).error(function (data) {});
                $http.get('http://localhost:8000/key/ttp').success(function (data)
                {
                    $localStorage.ttp = data;
                    //window.localStorage.setItem('TTP', JSON.stringify(data));
                }).error(function (data) {});
            };
            $scope.clicked = function () 
            {
                $state.go("registrar");
            };
            $scope.logout = function ()
            {
                //$localStorage.$reset();
                delete $localStorage.user;
                $state.go("index");
            }
        }
    ]
);
