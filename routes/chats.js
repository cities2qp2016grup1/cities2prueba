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
router.get('/:asignatura', function (req, res) {
    console.log('Buscando en la BBDD: '+req.params.asignatura+'\n');
    Chat.find({asignatura: req.params.asignatura}, function (err, chats) {
        console.log(chats);
        if (chats.length == 0) {
            return res.status(404).jsonp({"respuesta": "no hay chats"});
        }
        else {
            return res.status(200).jsonp({"chats":chats});
        }
    });
});
module.exports = router;