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
//var hash = crypto.createHash('md5').update(data).digest('hex');


/* No tengo ni idea de donde hacerlo
// generate a 512-bit key
var key = secrets.random(512); // => key is a hex string

// split into 10 shares with a threshold of 5
var shares = secrets.share(key, 10, 5);
// => shares = ['801xxx...xxx','802xxx...xxx','803xxx...xxx','804xxx...xxx','805xxx...xxx']

// combine 4 shares
var comb = secrets.combine( shares.slice(0,4) );
console.log(comb === key); // => false

// combine 5 shares
var comb = secrets.combine( shares.slice(4,9) );
console.log(comb === key); // => true

// combine ALL shares
var comb = secrets.combine( shares );
console.log(comb === key); // => true

// create another share with id 8
var newShare = secrets.newShare(8, shares); // => newShare = '808xxx...xxx'

// reconstruct using 4 original shares and the new share:
var comb = secrets.combine( shares.slice(1,5).concat(newShare) );
console.log(comb === key); // => true */

//POST - Recibir todos los usuarios
router.post('/allusers',function (require, result){
    
});

//POST - Recibir todos los usuarios
router.post('/firma',function (require, result){
    console.log(require.body.mensaje);
    var KpubCiega = require.body.mensaje;
    //crear claves pública y privada y enviar al cliente la pública
    var keys = rsa.generateKeys(1024); // Change to at least 2048 bits in production state
    console.log("--------------");
    console.log(keys);
    console.log("--------------");
    var firmar= bignum.fromBuffer(new Buffer(KpubCiega));
    var KpubFirmada = keys.publicKey.encrypt(firmar);
    var messageToClient = KpubFirmada.toString();
    result.status(200).send(messageToClient);
    var pubKey = {
        bits: keys.publicKey.bits,
        n: keys.publicKey.n.toString(),
        e: keys.publicKey.e.toString()
    };
    console.log(pubKey);
    var messageToServer= JSON.stringify(pubKey);
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/server/firma',
        method: 'POST',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req= http.request(options, function(res){
        res.on('data', function(chunk){
            if (chunk=="OK")
            {
                console.log("Clave publica entregada correctamente");
            }
            else 
            {
                console.log("Error en el envio de la clave");
            }
        });
    });
    req.write(messageToServer);
    req.end();
});
//GET - Reenviar peticion de enviar mensaje a servidor
router.post('/addmessage',function (require, result) {
    console.log("Cliente envia mensaje a B a traves de TTP");
    console.log("1: A-->TTP: (TTP, B, M, Po) (Paso hecho en cliente)");
    console.log(require.body);
    console.log('\n');
    console.log("2: TTP-->A: (A, B, Tr, L, Ps)");

    // coje los datos necesarios para crear los mensajes:
    var total =require.body.mensaje;
    console.log(total);
    var trozos = total.split("***");
    var a="A";
    var b=trozos[1];
    var Tr= Date.now();
    var L=Math.floor(Math.random() * 1000) + 1;
    var M=trozos[2];
    var Po=trozos[3];
    var pubkA= JSON.parse(trozos[4]);
    var keyA = new rsa.publicKey(pubkA.bits, bignum(pubkA.n), bignum(pubkA.e));
    console.log(keyA);
    var Ps= a+'*-*'+b+'*-*'+Tr+'*-*'+L+'*-*'+Po;
    var recibidoBignum = bignum(Po);
    console.log(recibidoBignum);
    var reqdecrip = keyA.decrypt(recibidoBignum);
    console.log(new Buffer(reqdecrip.toString()).toString());
    //cojo la publicKey y private Key de TTP
    var prikTTP = JSON.parse(localStorage.getItem("TTPprivada"));
    var pubkTTP = JSON.parse(localStorage.getItem("TTPpublica"));
    var keys2= {};
    keys2.publicKey = new rsa.publicKey(pubkTTP.bits, bignum(pubkTTP.n), bignum(pubkTTP.e));
    keys2.privateKey = new rsa.privateKey(bignum(prikTTP.p), bignum(prikTTP.q), bignum(prikTTP.d), keys2.publicKey);
    //firmo Ps con la privada
    var Psbignum = bignum.fromBuffer(new Buffer(Ps.toString()));
    var Pscrip = keys2.privateKey.encrypt(Psbignum);
    //creo el mensaje a A y lo encripto
    var mensajeToA = a+"***"+b+"***"+Tr+"***"+L+"***"+Pscrip;
    result.status(200).send(mensajeToA);

    console.log('\n');
    console.log("3: TTP-->B: (A, L, Po)");

    //encripto el mensaje a B
    var mensajeToB = JSON.stringify({mensaje3:a+"***"+L+"***"+Po,mensaje5:a+"***"+L+"***"+M});

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
            console.log(recibidoBignum);
            var reqdecrip = publicKeyServer.decrypt(recibidoBignum);
            var claro=reqdecrip.toBuffer().toString();
            console.log (claro);
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