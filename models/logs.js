const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;

let logSchema = new Schema({
    host: {
        type: String,
        required: [true, 'Ingresa el host']
    },
    usuario: {
        type: String
    },
    date: {
        type: Date
    },
    peticion: {
        type: String
    },
    sitio: {
        type: String
    },
    dispositivo: {
        type: String
    },
    valores: {
        type: Array
    }

});

//crea el id autoincrementable 
autoIncrement.initialize(mongoose.connection);
logSchema.plugin(autoIncrement.plugin, {
    model: '_id',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

logSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});


module.exports = mongoose.model('Log', logSchema);