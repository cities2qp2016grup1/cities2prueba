/**
 * Created by manel on 12/3/16.
 */
cities2.controller
('mainCtrl',
    ['$scope', '$state','$http','$rootScope','$localStorage',
        function($scope, $state, $http, $rootScope, $localStorage)
        {
            $scope.init = function ()
            {
                var keys= rsaMax.generateKeys(1024);

                var bits = keys.publicKey.bits.toString();
                var n = keys.publicKey.n.toString();
                var e = keys.publicKey.e.toString();
                var pubKeyJSON={
                    bits:bits,
                    n:n,
                    e:e
                };
                console.log(pubKeyJSON);

                var p =keys.privateKey.p.toString();
                var q = keys.privateKey.q.toString();
                var d = keys.privateKey.d.toString();
                var privKeyJSON={
                    p:p,
                    q:q,
                    d:d
                };
                console.log(privKeyJSON);

                $localStorage.privateKey = pubKeyJSON;
                $localStorage.publicKey = privKeyJSON;

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
        }
    ]
);
