/**
 * Created by manel on 14/3/16.
 */
var express = require('express');
var router = express.Router();
var http = require("http");

//POST - Reenviar suma a server
router.post('/sumar', function (require, result) {
    TTPhiserver(function(saludo){
        console.log(saludo);
        console.log("+++++++++++++++++++++")
    });
    console.log('POST /reenvio suma');
    console.log(require.body);
    var data = JSON.stringify(require.body);
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/operaciones/sumar',
        method: 'POST',
        json:true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            console.log("Devuelto a TTP: " + chunk);
            result.status(200).send(chunk);
        });
    });
    req.write(data);
    req.end();
});
//POST - Reenviar resta a server
router.post ('/restar',function (require, result) {
    TTPhiserver(function(saludo){
        console.log(saludo);
        console.log("+++++++++++++++++++++")
    });
    console.log('POST /reenvio resta');
    console.log(require.body);
    var data = JSON.stringify(require.body);
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/operaciones/restar',
        method: 'POST',
        json:true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            console.log("Devuelto a TTP: " + chunk);
            result.status(200).send(chunk);
        });
    });
    req.write(data);
    req.end();
});
    //POST - Reenviar multiplicación a server
router.post('/multiplicar',function (require, result) {
    TTPhiserver(function(saludo){
        console.log(saludo);
        console.log("+++++++++++++++++++++")
    });
    console.log('POST /reenvio multiplicacion');
    console.log(require.body);
    var data = JSON.stringify(require.body);
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/operaciones/multiplicar',
        method: 'POST',
        json:true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            console.log("Devuelto a TTP: " + chunk);
            result.status(200).send(chunk);
        });
    });
    req.write(data);
    req.end();
});
//POST - Reenviar división a server
router.post('/dividir',function (require, result) {
    TTPhiserver(function(saludo){
        console.log(saludo);
        console.log("+++++++++++++++++++++")
    });
    console.log('POST /reenvio division');
    console.log(require.body);
    var data = JSON.stringify(require.body);
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/operaciones/dividir',
        method: 'POST',
        json:true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            console.log("Devuelto a TTP: " + chunk);
            result.status(200).send(chunk);
        });
    });
    req.write(data);
    req.end();
});

//GET - Recibir todos los usuarios
router.get('/allusers',function (require, result){
    TTPhiserver(function(saludo){
        console.log(saludo);
        console.log("+++++++++++++++++++++")
    });
    console.log("Cliente pide recibir users a TTP");
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/server/allusers',
        method: 'GET'
    };
    http.get(options, function(res){
        res.on('data', function(chunk){
            console.log("Devuelto a TTP:"+ chunk);
            result.status(200).send(chunk);
            console.log("Usuarios enviados al cliente");
            });
    });
});
//POST - Reenviar nuevo usuario a server
router.post('/adduser',function (require, result) {
    TTPhiserver(function(saludo){
        console.log(saludo);
        console.log("+++++++++++++++++++++")
    });
    console.log('POST /reenvio nuevo user');
    console.log(require.body);
    var data = JSON.stringify(require.body);
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/server/adduser',
        method: 'POST',
        json:true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            console.log("Devuelto a TTP: " + chunk);
            result.status(200).send(chunk);
        });
    });
    req.write(data);
    req.end();
});

//Cliente saluda a TTP y TTP devuelve saludo
router.get('/hi', function (require, result){
    console.log("+++++++++++++++++++++");
    console.log("Cliente saluda a TTP");
    result.status(200).send("OK");
    console.log("TTP contesta a cliente");
    console.log("+++++++++++++++++++++");
});
//Saludar a server y obtener respuesta
function TTPhiserver(callback){
    console.log("+++++++++++++++++++++");
    console.log("TTP saluda a Server");
    var options = {
        host: 'localhost',
        port: 8000,
        path: '/server/hiserver',
        method: 'GET'
    };
    http.get(options, function(res){
        res.on('data', function(chunk){
            //console.log("Devuelto a TTP:"+ chunk);
        });
    });
    var ok = "Server responde a TTP";
    return callback (ok);
}
module.exports = router;