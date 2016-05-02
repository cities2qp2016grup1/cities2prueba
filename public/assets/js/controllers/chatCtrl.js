/**
 * Created by manel on 2/5/16.
 */
cities2.controller('chatCtrl',['$rootScope', '$scope', '$state','$http','md5','$localStorage','$sessionStorage',  function($rootScope, $scope, $state, $http, md5, $localStorage, $sessionStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    var socket = io();
    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
}]);