/**
 * Created by manel on 12/3/16.
 */
cities2.controller('mainCtrl',['$scope', '$state','$http','$rootScope', function($scope, $state, $http, $rootScope, storage) {
    $scope.init = function ()
    {
        $http.get('http://localhost:8000/key')
            .success(function (data)
            {

                //storage.bind($scope, 'data');
                storage.set('key','data');
                console.log(storage.get('key'));

                /*localStorage.setItem(data);
                 var key = localStorage.getItem("key");
                 console.log(key);*/
                //console.log(data);
            })
            .error(function (data) {});

    };
    /*window.onload = function () {}*/
}]);
