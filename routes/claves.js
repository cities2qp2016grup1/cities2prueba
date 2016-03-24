/**
 * Created by manel on 18/3/16.
 */
var express = require('express');
var router = express.Router();
var Clave = require('../models/clave.js');

router.get('/',function (req, res) {
/*  EN DESUSO PERO AQUI SE QUEDA POR SI ACASO

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
    console.log(pubKey);
    res.status(200).jsonp(pubKey);
*/
    Clave.find(function (err, clave) {
        if (err) res.send(500, err.message);
        console.log('GET /claves');
        console.log(clave);
        res.status(200).jsonp(clave);
    });
});    
module.exports = router;

/* ejemplo para cuando encriptemos (esto se pone en el cliente antes de enviar)
 var mensaje = {'nombre':'a', 'ciudad':'a'};
 m = bignum.fromBuffer(new Buffer(mensaje.toString()));
 var crip = keys.publicKey.encrypt(m);
 console.log(crip.toString());
 */