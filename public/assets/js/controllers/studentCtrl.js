/**
 * Created by manel on 25/4/16.
 */
cities2.controller('studentCtrl',['$rootScope', '$scope', '$state','$stateParams','$http','md5','$sessionStorage','$localStorage', function($rootScope, $scope, $state, $stateParams, $http, md5, $sessionStorage, $localStorage) {
    $rootScope.isLogged=true;
    $rootScope.isLogged2=false;
    $rootScope.salir=true;
    //console.log($stateParams.data); no va, mirar en el futuro
    var refresh = function () {
        $rootScope.asignaturas=$localStorage.user.asignaturas;
    };
    refresh();
    $scope.subject=$stateParams.id;
    
    $scope.getSubjectChat = function (id) {
        console.log("Obtener Chats de: "+id);
        $http.get('/chats/getChats/'+id)
            .success(function (data) {
                console.log(data);
                $rootScope.chats=data.chats;
            })
            .error(function (data) {

            })
    };

    $scope.getBlindEncryption =function () {
        /*Generamos Clave Publica y Privada del Cliente*/
        var keys= rsaMax.generateKeys(1024);
        var pubKeyJSON={
            e:keys.publicKey.e.toString(),
            n:keys.publicKey.n.toString(),
            bits:keys.publicKey.bits.toString()
        };
        var privKeyJSON={
            p:keys.privateKey.p.toString(),
            q:keys.privateKey.q.toString(),
            d:keys.privateKey.d.toString()
        };

        /*Generation of blinding factor*/
     //   var r = Math.floor(Math.random()*65537)+1;
     //   console.log("Factor de cegado: " + r);

        var r = new BigInteger(keys.publicKey.bits,1,new SecureRandom());
        console.log("Factor de cegado: " + r);
        /*Multiplication of blinding factor by Publi Key*/
        var pubKey = new BigInteger(JSON.stringify(pubKeyJSON));

        var blindMsg = pubKey.multiply(r.modPow(keys.publicKey.e, keys.publicKey.n)).mod(keys.publicKey.n);
        console.log("Public Key multiplied by r^eT mod nT " + blindMsg);
        $http.post('http://localhost:3000/ttp/firma', blindMsg)
            .success(function (data) {
                console.log(data);
            })
            .error(function (data) {
            })
    };
}]);