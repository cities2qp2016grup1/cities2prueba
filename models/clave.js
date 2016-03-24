/**
 * Created by manel on 23/3/16.
 */
var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var claveSchema = new Schema({
    publicKey: {
        bits: {type: Number},
        n: {type: String},
        e: {type: String}
    },
    privateKey: {
        p:{type: String},
        q:{type: String},
        d:{type: String},
        publicKey:{type: Object}
    }
});

module.exports = mongoose.model('Claves', claveSchema);