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
    console.log("Cliente pide recibir users a TTP");
    console.log("1: A-->TTP: (TTP, B, M, Po) (Paso hecho en cliente)");
    console.log(require.body);
    console.log('\n');
    console.log("2: TTP-->A: (A, B, Tr, L, Ps)");
    // TTP desencripta el mensaje de A con la privada de TTP

    // coje los datos necesarios para crear los mensajes:
    var total =require.body.mensaje;
    console.log(total);
    var trozos = total.split(",");
    var a="A";
    var b=trozos[1];
    var Tr= Date.now();
    var L="L";
    var Po=trozos[2];
    var PsJSON={
        a:a,
        b:b,
        Tr:Tr,
        L:L,
        Po:Po
    };
    var Ps= PsJSON.a+','+PsJSON.b+','+PsJSON.Tr+','+PsJSON.L+','+PsJSON.Po;//debera ir encriptado por la privada del TTP (firmado)
    //cojo la publicKey y private Key de TTP
    var prikTTP = JSON.parse(localStorage.getItem("TTPprivada"));
    var pubkTTP = JSON.parse(localStorage.getItem("TTPpublica"));
    var keys= {};
    keys.publicKey = new rsa.publicKey(pubkTTP.bits, bignum(pubkTTP.n), bignum(pubkTTP.e));
    keys.privateKey = new rsa.privateKey(bignum(prikTTP.p), bignum(prikTTP.q), bignum(prikTTP.d), keys.privateKey);
    //encripto Ps con la privada
    var Psbignum = bignum.fromBuffer(new Buffer(Ps.toString()));
    var Pscrip = keys.publicKey.encrypt(Psbignum);
    var mensajeToA ={
        a:a,
        b:b,
        Tr:Tr,
        L:L,
        Ps:Pscrip.toString()
    };  //encriptado con la publica de A
    //cojo la publicKey de A
    
    //encripto el mensaje a A
    
    console.log(mensajeToA);
    console.log('\n');
    console.log("3: TTP-->B: (A, L, Po)");
    var mensajeToBJSON={
        a:a,
        L:L,
        Po:Po
    };
    var mensajeToB=mensajeToBJSON.a+','+mensajeToBJSON.L+','+mensajeToBJSON.Po;//encriptado con la publica de B
    //cojo la publicKey de B
    var pubkServer = JSON.parse(localStorage.getItem("Serverpublica"));
    var keys2= {};
    keys2.publicKey = new rsa.publicKey(pubkServer.bits, bignum(pubkServer.n), bignum(pubkServer.e));
    //encripto el mensaje a B
    //var msg = "MANEL";
    var mensajeToBbignum = bignum.fromBuffer(new Buffer(mensajeToB.toString()));
    var mensajeToBcrip = keys2.publicKey.encrypt(mensajeToBbignum);
    //
    var data = {"mensaje":mensajeToBcrip.toString()};
    console.log("Mensaje encriptado a B: ");
    console.log(data);
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/server/allusers',
        method: 'POST',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req= http.request(options, function(res){
         res.on('data', function(chunk){
             var respuesta = JSON.parse(chunk);
             console.log('\n');
             console.log("5: TTP-->A: (A, B, Td, L, K, Pr, Pd)");
             // TTP desencripta el mensaje de B con la privada de TTP

             // coje los datos necesarios para crear el mensaje
             var Pd = {
                 a:a,
                 b:b,
                 Td:Date.now(),
                 L:respuesta.L,
                 Pr:respuesta.Pr
             };  //deberá encriptar esto con la privada de TTP (firmar)
             var mensajeFinalA = {
                 a:a,
                 b:b,
                 Td:Date.now(),
                 L:respuesta.L, //esto ya viene encriptado con la pública de A desde B
                 K:"K",
                 Pr:respuesta.Pr,
                 Pd:Pd
             };  // deberá ir encriptado con la pública de A
             console.log(mensajeFinalA);
             console.log('\n');
             result.status(200).send({data:mensajeToA, data2:mensajeFinalA});
             console.log("6: TTP-->B: (L, M)");
             // los datos los hemos desencriptado arriba, solo los cojemos y enviamos
             var mensajeFinalB = {
                 L:respuesta.L,
                 M:require.body.M
             }; // encriptado con la pública de B
             var data2 = JSON.stringify(mensajeFinalB);
             var options = {
                 host: 'localhost',
                 port: 8000,
                 path: '/server/final',
                 method: 'POST',
                 json:true,
                 headers: {
                     'Content-Type': 'application/json'
                 }
             };
             var req2 = http.request(options, function(res2) {
                 res2.on('data', function (chunk) {
                     console.log("Transmisión finalizada");
                     console.log('\n');
                 })
             });
             req2.write(data2);
             req2.end();
         });
    });
    req.write(JSON.stringify(data));
    req.end();
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
    // TTP desencripta el mensaje de A con la privada de TTP

    // coje los datos necesarios para crear los mensajes:
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/server/addmessage',
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
                console.log("Mensaje entregado correctamente");
            }
            else
            {
                console.log("Error en el envio del mensaje");
            }
        });
    });
    req.write(mensaje);
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