var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var rsa = require('../rsa/rsa-bignum.js');
var bignum = require('bignum');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

//GET - GET All Users By Into DB
router.post('/allusers', function (req, res) {
  console.log('GET /allusers');
  var recibido = req.body;
  console.log(recibido);
  User.find(function (err, users) {
    if (err) res.send(500, err.message);
    console.log(users);
    console.log('\n');
    console.log("4: B-->TTP: (L, Pr)");
    // B desencripta el mensaje de TTP con la privada de B
    //cojo la privateKey de B
    var prikServer = JSON.parse(localStorage.getItem("Serverprivada"));
    var pubkServer = JSON.parse(localStorage.getItem("Serverpublica"));
    var keys ={};
    keys.publicKey= new rsa.publicKey(pubkServer.bits, bignum(pubkServer.n), bignum(pubkServer.e));
    keys.privateKey= new rsa.privateKey(bignum(prikServer.p), bignum(prikServer.q), bignum(prikServer.d), keys.publicKey);
    //console.log(keys);
    //encripto con la privada de B
    var recibidoBignum = bignum(req.body.mensaje);
    console.log(recibidoBignum);
    var reqdecrip = keys.privateKey.decrypt(recibidoBignum);
    var claro=reqdecrip.toBuffer().toString();
    console.log(claro);
    //  coje los datos necesarios para crear los mensajes
    var a="A";
    var ttp="localhost:3000/ttp/allusers";
    var L=users;  //mensaje de respuesta a A (encriptado con publica de A?)
    var Po=req.body.Po;
    var Pr={
      ttp:ttp,
      a:a,
      L:L,
      Po:Po
    }; //debera ir encriptado por la privada de B (firmar)
    var mensajeToTTP ={
      L:L,
      Pr:Pr
    }; //deberá ir encriptado con la publica de TTP
    console.log(mensajeToTTP);
    res.status(200).jsonp(mensajeToTTP);
  });

});
//POST - Add User in DB
router.post('/adduser',  function (req, res) {
  console.log('POST /user');
  console.log(req.body);
  var user = new User({
    nombre:    req.body.nombre,
    email:     req.body.email,
    rol:    req.body.rol,
    password: req.body.password
  });
  console.log('\n');
  console.log("Devuelve el user registrado");
  user.save(function(err, user) {
    if(err) return res.status(500).send(err.message);
    console.log(user);
    res.status(200).jsonp(user);
  });
});

//POST - Comprovar user en DB
router.post('/login',  function (req, res) {
  console.log('LOGIN /user');
  console.log("Comprueba si la contraseña es correcta");
  User.find({email:req.body.email},function(err, user) {
    if (user.length == 0) {
      return res.status(404).jsonp({"loginSuccessful": false, "email": req.body.email});
    }
    else{
      var usuario = JSON.stringify(user);
      var trozos = usuario.split(",");
      var password = trozos[4].split(":");
      var pwd2 = password[1];
      var pwd1 = JSON.stringify(req.body.password);
      if (pwd1 == pwd2) {
        console.log ("Login Correcto");
        return res.status(200).jsonp({"loginSuccessful": true, "user": user});
      }
      else {
        console.log("Contraseña erronea");
        return res.status(404).jsonp({"loginSuccessful": false, "email": req.body.email});
      }
    }
  });
});

//POST - Add User in DB
router.post('/final',  function (req, res) {
  console.log(req.body);
  res.status(200).send("OK");
});
module.exports = router;
