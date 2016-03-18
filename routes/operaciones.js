var express = require('express');
var router = express.Router();
var Operacion = require('../models/operacion.js');

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
router.post('/restar', function (req, res) {
    console.log('Resta');
    console.log(req.body);
    var x = parseInt(req.body.num1);
    var y = parseInt(req.body.num2);
    resta = (x-y);
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