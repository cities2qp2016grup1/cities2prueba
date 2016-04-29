/**
 * Created by manel on 29/4/16.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var chatSchema = new Schema({
    creador: {type: String},
    estado: {type: String},
    asignatura: {type: String},
    mensajes: [
        {
            msg: {type: String},
            user: {type: String}
        }
    ]
});

module.exports = mongoose.model('Chat', chatSchema);