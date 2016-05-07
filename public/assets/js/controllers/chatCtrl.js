/**
 * Created by manel on 2/5/16.
 */
cities2.controller('chatCtrl',['$rootScope', '$scope', '$state','$http','md5','$localStorage','$sessionStorage',  function($rootScope, $scope, $state, $http, md5, $localStorage, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    var conectados = [];
    $scope.users=[];
    //var socket = io();
    var socket = io.connect('http://localhost:8000', { 'forceNew': true });
    socket.emit('newUser', $localStorage.user.nombre, function (data) {
    });
    socket.on('usernames', function(data){
        $scope.users = data;
        console.log($scope.users);
        var refresh = function () {
            $scope.users=data;
        };
        refresh();
    });
    $scope.enviaChat=function () {
        socket.emit('chat message', $scope.m);
        $scope.m=null;
        return false;
    };
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
}]);