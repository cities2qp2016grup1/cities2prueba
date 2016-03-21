/**
 * Created by manel on 12/3/16.
 */
cities2.controller('mainCtrl',['$scope', '$state','$http','$rootScope', function($scope, $state, $http, $rootScope) {
    $scope.init = function () {
        $http.get('http://localhost:8000/key')
            .success(function (data) {
                console.log(data);
            })
            .error(function (data) {
               
            });
    };
    /*window.onload = function () {
        
    }*/
}]);
