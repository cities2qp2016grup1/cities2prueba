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
        var trozos = req.body.mensaje[i].split("***");
        var b=trozos[0];
        var ttp=trozos[1];
        var a=trozos[2];
        var Po=trozos[3];
        var Pr=trozos[4];
        var comprovar=b+"***"+ttp+"***"+a+"***"+Po;
        var ComprovarHash = crypto.createHash('md5').update(comprovar).digest('hex');
        var pubkA= JSON.parse(trozos[5]);
        var keyA = new rsa.publicKey(pubkA.bits, bignum(pubkA.n), bignum(pubkA.e));

        //desencriptar -Po- para ver si los datos son correctos
        var recibidoBignum = bignum(Pr);
        var reqdecrip = keyA.decrypt(recibidoBignum);
        var PrClaro = reqdecrip.toBuffer().toString();
        console.log("Pr en claro: "+PrClaro);
        console.log(ComprovarHash);
        if (PrClaro==ComprovarHash)
        {
            console.log("Prueba Pr confirmada!")
        }
        else {
            console.log("ERROR. Pr invalida")
        }
        Mensaje.findOneAndUpdate({recName: req.params.nombre, estado: "enviado"}, { "$set": { estado: "recibido" , Pr: PrClaro} }, function(err,doc) {
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
            Po: PoClaro,
            confirmado: "No"
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

    
});
//POST - Pasar msg a leido
router.post('/leerMsg', function (req, res) {

    Mensaje.findOneAndUpdate({_id: req.body.id}, { "$set": { estado: "leido" } }, function(err,doc) {
            // work here
        }
    );
    
    res.status(200).send("ok");
    
});
//POST - Pasar msg a leido
router.post('/compruebaMsg', function (req, res) {

    Mensaje.findOneAndUpdate({_id: req.body.id}, { "$set": { confirmado: "Si" } },{new: true}, function(err,doc) {
        console.log("Devuelve: " + doc);
        console.log("6: TTP-->A: (TTP, A, B, Td, Pr, Pd)");
        /* var Pd =doc.ttp+"***"+doc.a+"***"+doc.b+"***"+doc.fecha+"***"+doc.Pr;
         var PdHash = crypto.createHash('md5').update(Pd).digest('hex');
         //coger la Kpriv de TTP para firmar el mensaje cegado
         var prikTTP = JSON.parse(localStorage.getItem("TTPprivada"));
         var pubkTTP = JSON.parse(localStorage.getItem("TTPpublica"));
         var keys= {};
         keys.publicKey = new rsa.publicKey(pubkTTP.bits, bignum(pubkTTP.n), bignum(pubkTTP.e));
         keys.privateKey = new rsa.privateKey(bignum(prikTTP.p), bignum(prikTTP.q), bignum(prikTTP.d), keys.publicKey);
         //firmo KpubCiega con la privada de TTP
         var PdBignum = bignum.fromBuffer(new Buffer(PdHash.toString()));
         var PdCrip = keys.privateKey.encrypt(PdBignum);
         var msg=doc.ttp+"***"+doc.a+"***"+doc.b+"***"+doc.fecha+"***"+doc.Pr+"***"+PdCrip;
         res.status(200).jsonp({mensaje:msg});
         */
    })

});
//POST - Recibir paso 4 de No repudio
router.get('/getMensajesEnviados/:nombre', function (req, res) {
    Mensaje.find({sendName: req.params.nombre}, function (err, msj) {
        if (msj.length == 0) {
            console.log("No tiene mensajes enviados");
            return res.status(200).jsonp({"respuesta":"no hay mensajes"});
        }
        else {
            console.log("Mensajes enviados: "+msj);
            return res.status(200).jsonp({"respuesta": msj});
        }
    });
});
module.exports = router;