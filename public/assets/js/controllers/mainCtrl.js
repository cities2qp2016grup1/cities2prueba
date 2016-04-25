/**
 * Created by manel on 12/3/16.
 */
cities2.controller
('mainCtrl',
    ['$rootScope', '$scope', '$state','$http','$localStorage',
        function($rootScope, $scope, $state, $http, $localStorage)
        {
            $rootScope.isLogged=false;
            $scope.init = function ()
            {
                var keys= rsaMax.generateKeys(1024);

                var bits = keys.publicKey.bits.toString();
                var n = keys.publicKey.n.toString();
                var e = keys.publicKey.e.toString();
                var pubKeyJSON={
                    e:e,
                    n:n,
                    bits:bits
                };
                //console.log(pubKeyJSON);

                var p =keys.privateKey.p.toString();
                var q = keys.privateKey.q.toString();
                var d = keys.privateKey.d.toString();
                var privKeyJSON={
                    p:p,
                    q:q,
                    d:d
                };
                //console.log(privKeyJSON);No need to show it
                
                $localStorage.privateKey = privKeyJSON;
                $localStorage.publicKey = pubKeyJSON;

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
            }
        }
    ]
);
