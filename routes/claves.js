/**
 * Created by manel on 18/3/16.
 */
module.exports = function (app) {
    var rsa = require('../rsa/rsa-bignum.js');
    var bignum = require('bignum');
    //crear claves pública y privada y enviar al cliente la pública
    var keys = rsa.generateKeys(1024); // Change to at least 2048 bits in production state
    console.log("--------------");
    console.log(keys);
    console.log("--------------");
};
