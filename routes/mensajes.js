/**
 * Created by manel on 16/5/16.
 */
var express = require('express');
var router = express.Router();
var Mensaje = require('../models/mensaje.js');
var rsa = require('../rsa/rsa-bignum.js');
var bignum = require('bignum');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

//POST - Crear chat
router.post('/addmessage', function (req, res) {
    //recibo la notificación de TTP (3) de que tengo un mensaje y el mensaje (5)
    var mensaje3 = req.body.mensaje3;
    console.log(mensaje3);
    var trozos = mensaje3.split("***");
    var A=trozos[0];
    var L=trozos[1];
    var Po=trozos[2];
    var mensaje5 = req.body.mensaje5;
    console.log(mensaje5);
    console.log('\n');
    console.log("4: B-->TTP: (L, Pr)");
    var ttp="http://localhost:3000/ttp/addmessage";
    //creo Pr = [TTP, A, L, PO]
    var Pr = ttp+"*-*"+A+"*-*"+L+"*-*"+Po;
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
    console.log(mensajeToTTP);
    /*var mensaje = new Mensaje({
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
     */
    res.status(200).jsonp(mensajeToTTP);
});
module.exports = router;