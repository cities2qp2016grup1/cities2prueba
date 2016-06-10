/**
 * Created by manel on 29/4/16.
 */
var express = require('express');
var router = express.Router();
var Chat = require('../models/chat.js');
var rsa = require('../rsa/rsa-bignum.js');
var bignum = require('bignum');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

//GET - Comprovar chats en DB
router.get('/getChats/:asignatura', function (req, res) {
    console.log('Buscando chats en la BBDD de: ' + req.params.asignatura + '\n');
    Chat.find({asignatura: req.params.asignatura}, function (err, chats) {
        console.log(chats.length + " chats");
        if (chats.length == 0) {
            return res.status(404).jsonp({"respuesta": "no hay chats"});
        }
        else {
            return res.status(200).jsonp({"chats": chats});
        }
    });
});
//POST - Crear chat
router.post('/addchat', function (req, res) {
    var chat = new Chat({
        nombre: req.body.nombre,
        creador: req.body.creador,
        estado: req.body.estado,
        asignatura: req.body.asignatura,
        votacion: "No realizada",
        key: req.body.key,
        mensajes: []
    });
    console.log("Crea chat en BD: \n" + chat);
    console.log('\n');
    chat.save(function (err, chat) {
        if (err) return res.status(500).send(err.message);
        console.log(chat);
        res.status(200).jsonp(chat);
    });
});
//POST - Crear chat
router.post('/votar', function (req, res) {

    var votorecibido = req.body.voto;
    var sextr = bignum(req.body.kpub);

    console.log ("voto recibido:" + votorecibido + " K pub: " + sextr);


    var pubkServer = JSON.parse(localStorage.getItem("TTPpublica"));
    var keys ={};
    keys.publicKey = new rsa.publicKey(pubkServer.bits, bignum(pubkServer.n), bignum(pubkServer.e));

    console.log ("Publica ttp: " + pubkServer.toString());

    /*var reqdecrip1 = keys.publicKey.decrypt(sextr).mod(keys.publicKey.n);
    //var votodecrip = decrips.decrypt(votorecibido);

    console.log("public desencriptada: " + reqdecrip1);
    keys.keypub = new rsa.publicKey(reqdecrip1.bits, bignum(reqdecrip1.n), bignum(reqdecrip1.e));
    var decripguai = keys.keypub.decrypt(votorecibido).mod(keys.keypub.n);
    console.log("public desencriptada: " + decripguai);*/


    var chat = new Chat({
        nombre: req.body.nombre,
        creador: req.body.creador,
        estado: req.body.estado,
        asignatura: req.body.asignatura,
        votacion: "No realizada",
        key: req.body.key,
        mensajes: []
    });
    console.log("Meter votación en la BD: \n" + chat);
    console.log('\n');
    chat.save(function (err, chat) {
        if (err) return res.status(500).send(err.message);
        console.log(chat);
        res.status(200).jsonp(chat);
    });
});

module.exports = router;