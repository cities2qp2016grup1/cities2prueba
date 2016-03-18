/**
 * Created by manel on 26/2/16.
 */
var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var userSchema = new Schema({
    nombre: {type: String},
    ciudad: {type: String}
})

module.exports = mongoose.model('User', userSchema);