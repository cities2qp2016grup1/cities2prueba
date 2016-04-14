var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var rsa = require('../rsa/rsa-bignum.js');
var bignum = require('bignum');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

//GET - GET All Users By Into DB
router.get('/allusers', function (req, res) {
  console.log('GET /allusers');
  console.log(req.body);
  User.find(function (err, users) {
    if (err) res.send(500, err.message);
    console.log(users);
    console.log('\n');
    console.log("4: B-->TTP: (L, Pr)");
    // B desencripta el mensaje de TTP con la privada de B
    //cojo la privateKey de B
    var prikServer = JSON.parse(localStorage.getItem("Serverprivada"));
    var pubkServer = JSON.parse(localStorage.getItem("Serverpublica"));
    var publicKServer = new rsa.publicKey(pubkServer.bits, pubkServer.n, pubkServer.e);
    var privateKServer = new rsa.privateKey(prikServer.p, prikServer.q, prikServer.d, publicKServer);
    //encripto con la privada de B
    var reqdecrip = privateKServer.decrypt(req);
    console.log(reqdecrip);
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
    nombre:    req.body.L.nombre,
    ciudad:     req.body.L.ciudad
  });
  console.log('\n');
  console.log("4: B-->TTP: (L, Pr)");
  user.save(function(err, user) {
    if(err) return res.status(500).send( err.message);
    var a="A";
    var ttp="localhost:3000/ttp/adduser";
    var L=user;
    var Po=req.body.Po;
    var Pr={
      ttp:ttp,
      a:a,
      L:L,
      Po:Po
    }; //debera ir encriptado por la privada de B (server)
    var mensajeToTTP ={
      L:L,
      Pr:Pr
    };
    console.log(mensajeToTTP);
    res.status(200).jsonp(mensajeToTTP);
  });
});

//POST - Add User in DB
router.post('/final',  function (req, res) {
  console.log(req.body);
  res.status(200).send("OK");
});
module.exports = router;
