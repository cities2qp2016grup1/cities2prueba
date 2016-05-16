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
});
module.exports = router;