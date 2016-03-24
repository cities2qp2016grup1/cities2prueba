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
                $http.get('http://localhost:8000/key').success(function (data)
                {
                    $localStorage.save = data;

                    console.log(data);

                }).error(function (data) {});
            };
        }
    ]
);



//storage.bind($scope, 'data');
/*storage.set('key','data');
 console.log(storage.get('key'));
 */
/*localStorage.setItem(data);
 var key = localStorage.getItem("key");
 console.log(key);*/
//console.log(data);