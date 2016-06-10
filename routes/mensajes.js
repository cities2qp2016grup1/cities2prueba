/**
 * Created by manel on 16/5/16.
 */
var express = require('express');
var router = express.Router();
var Mensaje = require('../models/mensaje.js');
var rsa = require('../rsa/rsa-bignum.js');
var crypto = require('crypto');
var bignum = require('bignum');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

//GET - Recibir mensajes de usuario
router.get('/getAllMensajes/:nombre', function (req, res) {
    console.log('Buscando mensajes de: '+req.params.nombre+'\n');
    Mensaje.find({recName: req.params.nombre}, function (err, msj) {
        console.log(msj.length+" mensajes");
        if (msj.length == 0) {
            return res.status(200).jsonp({"respuesta":"no hay mensajes"});
        }
        else {
            return res.status(200).jsonp({"respuesta":msj});
        }
    });
});
//GET - Recibir mensajes de usuario
router.get('/getMensajes/:nombre', function (req, res) {
    console.log('Buscando mensajes de: '+req.params.nombre+'\n');
    Mensaje.find({recName: req.params.nombre, estado:"enviado"}, function (err, msj) {
        console.log(msj.length+" mensajes");
        if (msj.length == 0) {
            return res.status(200).jsonp({"respuesta":"no hay mensajes sin leer"});
        }
        else {
            var mensajeToB=[];
            for ( var i=0; i<msj.length; i++)
            {
                console.log("3: TTP-->B: (TTP, B, A, Po)");
                var mensaje = "TTP"+"***"+msj[i].recName+"***"+msj[i].sendName+"***"+msj[i].Po;
                mensajeToB.push(mensaje);
            }
            console.log(mensajeToB);
            return res.status(200).jsonp({"respuesta":mensajeToB});
        }
    });
});
//POST - Recibir paso 4 de No repudio
router.post('/getMensajesTotal/:nombre', function (req, res) {
    console.log("4: B-->TTP: (B, TTP, A, Po, Pr)");
    console.log(req.body.mensaje.length);
    for (var i=0; i<req.body.mensaje.length;i++)
    {
        Mensaje.findOneAndUpdate({recName: req.params.nombre, estado: "enviado"}, { "$set": { estado: "recibido" } }, function(err,doc) {
                // work here
            }
        );
    }
    Mensaje.find({recName: req.params.nombre}, function (err, msj) {
        console.log(msj.length + " mensajes");
        if (msj.length == 0) {
            return res.status(500).send(err);
        }
        else {
            var mensajeToB = [];
            for (var i = 0; i < msj.length; i++) {
                console.log("5: TTP-->B: (TTP, B, M)");
                var mensaje = "TTP" + "***" + msj[i].recName + "***" + msj[i].mensaje;
                mensajeToB.push(mensaje);
            }
            console.log(mensajeToB);
            return res.status(200).jsonp({"respuesta": mensajeToB});
        }
    });
});
//POST - enviar mensaje personal
router.post('/addmessage', function (req, res) {
    console.log('\n');
    console.log("Cliente envia mensaje a B a traves de TTP");
    console.log("1: A-->TTP: (A,TTP, B, M, Po) (Paso hecho en cliente)");
    console.log(req.body);
    console.log('\n');
    console.log("2: TTP-->A: (TTP, A, B, Tr, Ps)");

    // coje los datos necesarios para crear los mensajes:
    var total =req.body.mensaje;
    console.log("Recibido: "+total);
    var trozos = total.split("***");
    var a=trozos[0];
    var ttp=trozos[1];
    var b=trozos[2];
    var Tr= Date.now();
    var M=trozos[3];
    var Po=trozos[4];
    var pubkA= JSON.parse(trozos[5]);
    var keyA = new rsa.publicKey(pubkA.bits, bignum(pubkA.n), bignum(pubkA.e));

    //desencriptar -Po- para ver si los datos son correctos
    var recibidoBignum = bignum(Po);
    var reqdecrip = keyA.decrypt(recibidoBignum);
    var PoClaro = reqdecrip.toBuffer().toString();
    console.log("Po en claro: "+PoClaro);

    //comprobar hash del M en Po con hash del M del mensaje
    var Mhash = crypto.createHash('md5').update(M).digest('hex');
    var trozosPo = PoClaro.split("*-*");
    var MhashPo = trozosPo[3];
    if (Mhash==MhashPo)
    {
        console.log("Prueba de origen correcta!");
        var Ps= ttp+'*=*'+a+'*=*'+b+'*=*'+Tr+'*=*'+Po;
        var Pshash = crypto.createHash('md5').update(Ps).digest('hex');
        var mensaje2 = ttp+"***"+a+"***"+b+"***"+Tr+"***"+Pshash;
        //guardarlo en la bbdd
        var mensaje = new Mensaje({
            sendName: a,
            recName: b,
            mensaje: M,
            fecha: Tr,
            estado: "enviado",
            Po: PoClaro
        });
        console.log('\n');
        mensaje.save(function(err, msj) {
            if(err) return res.status(500).send(err.message);
            console.log(msj);
        });
        res.status(200).jsonp(mensaje2);
    }
    else {
        console.log("ERROR, prueba de origen no coincide.")
    }

    ////////////////
    /* //recibo la notificación de TTP (3) de que tengo un mensaje y el mensaje (5)
    var mensaje3 = req.body.mensaje3;
    console.log("Recibido en Server (mensaje 3): "+mensaje3);
    var trozos = mensaje3.split("***");
    var A=trozos[0];
    var L=trozos[1];
    var Po=trozos[2];
    var pubkeyA=JSON.parse(trozos[3]);
    var keyA = new rsa.publicKey(pubkeyA.bits, bignum(pubkeyA.n), bignum(pubkeyA.e));
    //desencriptar -Po- para ver si los datos son correctos
    var recibidoBignum = bignum(Po);
    var reqdecrip = keyA.decrypt(recibidoBignum);
    var PoClaro = reqdecrip.toBuffer().toString();
    console.log("Po en claro: "+PoClaro);
    var mensaje5 = req.body.mensaje5;
    console.log("Recibido en Server: (mensaje 5): "+mensaje5);
    console.log('\n');
    console.log("4: B-->TTP: (L, Pr)");
    console.log("Recibido: "+ req.body.mensaje3);
    var ttp="localhost:3000/ttp/addmessage";
    //creo Pr = [TTP, A, L, PO]
    var Pr = ttp+"*_*"+A+"*_*"+L+"*_*"+"Po";
    //para pasar a base 64 (aun NO) var a=  new Buffer(Pr).toString('base64');
    //cojo la privada de Server para firmar Pr
    var prikServer = JSON.parse(localStorage.getItem("Serverprivada"));
    var pubkServer = JSON.parse(localStorage.getItem("Serverpublica"));
    var keysServer= {};
    keysServer.publicKey = new rsa.publicKey(pubkServer.bits, bignum(pubkServer.n), bignum(pubkServer.e));
    keysServer.privateKey = new rsa.privateKey(bignum(prikServer.p), bignum(prikServer.q), bignum(prikServer.d), keysServer.publicKey);
    //firmo Ps con la privada
    var Prbignum = bignum.fromBuffer(new Buffer(Pr.toString()));
    var Prcrip = keysServer.privateKey.encrypt(Prbignum);
    //creo el mensaje a A y lo encripto
    var mensajeToTTP = {
        L:L,
        Pr:Prcrip.toString()
    };
    console.log("Mensaje 4 a TTP: "+ JSON.stringify(mensajeToTTP));
    console.log("\n5: TTP-->B: (L, M) ya enviado\n");
    var mensaje = new Mensaje({
        sendName:    req.body.nombre,
        recName:     req.body.creador,
        mensaje:    req.body.mensaje,
        fecha:      req.body.fecha
    });
    console.log("Guarda mensaje privado en BD: \n"+mensaje);
    console.log('\n');
    mensaje.save(function(err, mensaje) {
        if(err) return res.status(500).send(err.message);
        console.log(mensaje);
        res.status(200).jsonp(mensaje);
    });

    res.status(200).jsonp(mensajeToTTP);
     */
});
//POST - Pasar msg a leido
router.post('/leerMsg', function (req, res) {

    Mensaje.findOneAndUpdate({_id: req.body.id}, { "$set": { estado: "leido" } }, function(err,doc) {
            // work here
        }
    );
    
    res.status(200).send("ok");
    
});
module.exports = router;