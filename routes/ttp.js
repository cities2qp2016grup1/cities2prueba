/**
 * Created by manel on 14/3/16.
 */
var express = require('express');
var router = express.Router();
var http = require("http");
var crypto = require('crypto');
var rsa = require('../rsa/rsa-bignum.js');
var bignum = require('bignum');
var Chat = require('../models/chat.js');
var secret = require('secrets.js');

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

//POST - Recibir todos los usuarios
router.post('/allusers',function (require, result){

});

//POST - Recibir todos los usuarios
router.post('/firma',function (require, result){
    console.log("Kpub Ciega recibida en TTP");
    console.log(require.body.mensaje);
    var KpubCiega = require.body.mensaje;
    //coger la Kpriv de TTP para firmar el mensaje cegado
    var prikTTP = JSON.parse(localStorage.getItem("TTPprivada"));
    var pubkTTP = JSON.parse(localStorage.getItem("TTPpublica"));
    var keys= {};
    keys.publicKey = new rsa.publicKey(pubkTTP.bits, bignum(pubkTTP.n), bignum(pubkTTP.e));
    keys.privateKey = new rsa.privateKey(bignum(prikTTP.p), bignum(prikTTP.q), bignum(prikTTP.d), keys.publicKey);
    //firmo KpubCiega con la privada de TTP
    var KpubCiegaBignum = bignum.fromBuffer(new Buffer(KpubCiega.toString()));
    var CiegaTTP = keys.privateKey.encrypt(KpubCiegaBignum);
    console.log("Kpub Ciega firmada por TTP");
    console.log(CiegaTTP.toString());
    var messageToClient= CiegaTTP.toString();
    result.status(200).send({mensaje:messageToClient});
});
//GET - Reenviar peticion de enviar mensaje a servidor
router.post('/addmessage',function (require, result) {
    console.log('\n');
    console.log("Cliente envia mensaje a B a traves de TTP");
    console.log("1: A-->TTP: (TTP, B, M, Po) (Paso hecho en cliente)");
    console.log(require.body);
    console.log('\n');
    console.log("2: TTP-->A: (A, B, Tr, L, Ps)");

    // coje los datos necesarios para crear los mensajes:
    var total =require.body.mensaje;
    console.log("Recibido: "+total);
    var trozos = total.split("***");
    var a="A";
    var b=trozos[1];
    var Tr= Date.now();
    var L=Math.floor(Math.random() * 1000) + 1;
    var M=trozos[2];
    var Po=trozos[3];
    var pubkA= JSON.parse(trozos[4]);
    var keyA = new rsa.publicKey(pubkA.bits, bignum(pubkA.n), bignum(pubkA.e));

    //desencriptar -Po- para ver si los datos son correctos
    var recibidoBignum = bignum(Po);
    var reqdecrip = keyA.decrypt(recibidoBignum);
    var PoClaro = reqdecrip.toBuffer().toString();
    console.log("Po en claro: "+PoClaro);
    var Ps= a+'*=*'+b+'*=*'+Tr+'*=*'+L+'*=*'+PoClaro;
    //cojo la publicKey y private Key de TTP
    var prikTTP = JSON.parse(localStorage.getItem("TTPprivada"));
    var pubkTTP = JSON.parse(localStorage.getItem("TTPpublica"));
    var keys2= {};
    keys2.publicKey = new rsa.publicKey(pubkTTP.bits, bignum(pubkTTP.n), bignum(pubkTTP.e));
    keys2.privateKey = new rsa.privateKey(bignum(prikTTP.p), bignum(prikTTP.q), bignum(prikTTP.d), keys2.publicKey);
    //firmo Ps con la privada
    var Psbignum = bignum.fromBuffer(new Buffer(Ps.toString()));
    var Pscrip = keys2.privateKey.encrypt(Psbignum);
    //creo el mensaje a A y lo envio
    var mensajeToA = a+"***"+b+"***"+Tr+"***"+L+"***"+Pscrip;
    console.log("Enviando: "+ mensajeToA);

    console.log('\n');
    console.log("3: TTP-->B: (A, L, Po) ---- y ---- 5: TTP-->B: (L, M)");

    // mensaje a B
    var mensajeToB = JSON.stringify({mensaje3:a+"***"+L+"***"+Po+"***"+trozos[4],mensaje5:a+"***"+L+"***"+M});

    var options = {
        host: 'localhost',
        port: 8000,
        path: '/mensajes/addmessage',
        method: 'POST',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req= http.request(options, function(res){
        res.on('data', function(chunk){
            var Prcrip=JSON.parse(chunk);
            console.log("Recibiendo 4 (confirmación Server)");
            console.log(Prcrip);
            //cojo la public Key de server
            var pubkServer = JSON.parse(localStorage.getItem("Serverpublica"));
            var publicKeyServer = new rsa.publicKey(pubkServer.bits, bignum(pubkServer.n), bignum(pubkServer.e));
            var recibidoBignum = bignum(Prcrip.Pr);
            var reqdecrip = publicKeyServer.decrypt(recibidoBignum);
            var Prclaro=reqdecrip.toBuffer().toString();
            console.log ("Pr en claro: "+Prclaro);
            console.log("\n6: TTP-->A: (A, B, Td, L, Pr, Pd)\n");
            // coje los datos necesarios para crear mensaje 6:
            var Td= Date.now();
            var Pd= a+"*<*"+b+"*<*"+Td+"*<*"+L+"*<*"+Prclaro;
            //firmo Pd con la privada
            var Pdbignum = bignum.fromBuffer(new Buffer(Pd.toString()));
            var Pdcrip = keys2.privateKey.encrypt(Pdbignum);
            console.log("Pd en cripto: "+Pdcrip);
            var mensaje6toA= a+"***"+b+"***"+Td+"***"+L+"***"+Prclaro+"***"+Pdcrip;
            console.log("Mensaje 6 enviado: "+mensaje6toA);
            result.status(200).send({mensaje2:mensajeToA,mensaje6:mensaje6toA});
        });
    });
    req.write(mensajeToB);
    req.end();
});
/*
//GET - Reenviar peticion de chats a servidor
router.get('/chats/:asignatura',function (require, result) {
    console.log('Obtener chats de '+require.params.asignatura+'\n');

    http.get("http://localhost:8000/chats/"+require.params.asignatura, function(res) {
        res.on("data", function (chunk) {
            console.log('\n');
            result.status(200).send(chunk);
        });
    });
});
*/

module.exports = router;