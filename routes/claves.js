/**
 * Created by manel on 18/3/16.
 */
var express = require('express');
var router = express.Router();
var rsa = require('../rsa/rsa-bignum.js');
var bignum = require('bignum');

router.get('/',function (req, res) {

    //crear claves pública y privada y enviar al cliente la pública
    var keys = rsa.generateKeys(1024); // Change to at least 2048 bits in production state
    console.log("--------------"); 
    console.log(keys);
    console.log("--------------");
    var pubKey = {
        bits: keys.publicKey.bits,
        n: keys.publicKey.n.toString(),
        e: keys.publicKey.e.toString()
    };
    res.status(200).jsonp(pubKey);
});

module.exports = router;

/* ejemplo para cuando encriptemos (esto se pone en el cliente antes de enviar)
 var mensaje = {'nombre':'a', 'ciudad':'a'};
 m = bignum.fromBuffer(new Buffer(mensaje.toString()));
 var crip = keys.publicKey.encrypt(m);
 console.log(crip.toString());
 */