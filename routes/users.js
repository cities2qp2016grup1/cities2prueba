var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var rsa = require('../rsa/rsa-bignum.js');
var bignum = require('bignum');

//GET - GET All Users By Into DB
router.get('/allusers', function (req, res) {
  User.find(function (err, users) {
    if (err) res.send(500, err.message);
    console.log('GET /allusers');
    res.status(200).jsonp(users);
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
