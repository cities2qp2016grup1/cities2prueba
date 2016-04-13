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
