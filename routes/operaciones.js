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
router.post('/sumar', function (req, res)
{

    var num1 = bignum(req.body.num1);
    var num2 = bignum(req.body.num2);
    var n2 = bignum(req.body.n2);
    
    console.log('Hacemos la suma');
    console.log('Los valores:\n num1 = ' + num1 + "\n num2 = " + num2);
    var suma = num1.mul(num2).mod(n2);
    console.log("Resultado de la suma estando los valores encriptados: "+ suma.toString(10));
    res.status(200).jsonp(suma.toString(10));
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

    console.log("Números desencriptados:");
    var reqdecrip1 = keys.privateKey.decrypt(num1).mod(keys.publicKey.n);
    var claro1 = reqdecrip1.toString(10);
    var reqdecrip2 = keys.privateKey.decrypt(num2).mod(keys.publicKey.n);
    var claro2 = reqdecrip2.toString(10);
    
    console.log('Resta');
    var resta = rsa.publicKey.add(num1, num2);
    var resta = claro1 - claro2;
    console.log("Resultado: " + resta);
    res.status(200).jsonp(resta);
});

//Hacer multiplicacion y devolver resultado
router.post('/multiplicar', function(req, res) {
    console.log('Multiplicación');
    console.log(req.body);
    var x = parseInt(req.body.num1);
    var y = parseInt(req.body.num2);
    multiplicar = (x*y);
    console.log("4"+ multiplicar);
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