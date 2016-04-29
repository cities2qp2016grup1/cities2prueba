var express = require('express');
var router = express.Router();
var Operacion = require('../models/operacion.js');
var rsa = require('../rsa/rsa-bignum.js');
var bignum = require('bignum');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

var prikServer = JSON.parse(localStorage.getItem("Serverprivada"));
var pubkServer = JSON.parse(localStorage.getItem("Serverpublica"));
var keys ={};
keys.publicKey= new rsa.publicKey(pubkServer.bits, bignum(pubkServer.n), bignum(pubkServer.e));
keys.privateKey= new rsa.privateKey(bignum(prikServer.p), bignum(prikServer.q), bignum(prikServer.d), keys.publicKey);

//Hacer suma y devolver resultado
router.post('/sumar', function (req, res) {
    console.log('Suma');
    console.log(req.body);
    var x = parseInt(req.body.num1);
    var y = parseInt(req.body.num2);
    suma = (x+y);
    console.log("Resultado: "+ suma);
    res.status(200).jsonp(suma);
});

//Hacer resta y devolver resultado
router.post('/restar', function (req, res)
{
    var num1 = bignum(req.body.num1);
    var num2 = bignum(req.body.num2);

    var prikServer = JSON.parse(localStorage.getItem("Serverprivada"));
    var pubkServer = JSON.parse(localStorage.getItem("Serverpublica"));
    var keys ={};
    keys.publicKey= new rsa.publicKey(pubkServer.bits, bignum(pubkServer.n), bignum(pubkServer.e));
    keys.privateKey= new rsa.privateKey(bignum(prikServer.p), bignum(prikServer.q), bignum(prikServer.d), keys.publicKey);



    var reqdecrip1 = keys.privateKey.decrypt(num1);
    var claro1 = reqdecrip1.toBuffer().toString();
    console.log(claro1);
    var reqdecrip2 = keys.privateKey.decrypt(num2);
    var claro2 = reqdecrip2.toBuffer().toString();
    console.log(claro2);



    console.log('Resta');
    console.log(req.body);
    var num1 = parseInt(req.body.num1);
    var num2 = parseInt(req.body.num2);
    var resta = (num1 - num2);
    console.log("Resultado: "+ resta);
    res.status(200).jsonp(resta);



});

//Hacer multiplicacion y devolver resultado
router.post('/multiplicar', function(req, res) {
    console.log('Multiplicación');
    console.log(req.body);
    var x = parseInt(req.body.num1);
    var y = parseInt(req.body.num2);
    multiplicar = (x*y);
    console.log("Resultado: "+ multiplicar);
    res.status(200).jsonp(multiplicar);
});

//Hacer division y devolver resultado
router.post('/dividir', function (req, res) {
    console.log('División');
    console.log(req.body);
    var x = parseInt(req.body.num1);
    var y = parseInt(req.body.num2);
    dividir = (x/y);
    console.log("Resultado: "+ dividir);
    res.status(200).jsonp(dividir);
});




module.exports = router;