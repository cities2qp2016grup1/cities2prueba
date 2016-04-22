/**
 * Created by manel on 26/2/16.
 */
var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var userSchema = new Schema({
    nombre: {type: String},
    email: {type: String},
    rol: {type: String},
    password: {type: String},
    asignaturas: [String]
});

module.exports = mongoose.model('User', userSchema);