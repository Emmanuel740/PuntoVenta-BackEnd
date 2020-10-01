const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
//const Areas = require('./areas');
//const CM = require('./CM');

let Schema = mongoose.Schema;

let cuentaSchema = new Schema({
    codigo: {
        type: Schema.Types.Number,
        ref: 'User',

    },
    userid: {
        type: Schema.Types.Number,
        ref: 'User',
    },
    fecha: {
        type: Date
    },
    activo: {
        type: Boolean,
        default: true
    }

});

//crea el id autoincrementable 
autoIncrement.initialize(mongoose.connection);
cuentaSchema.plugin(autoIncrement.plugin, {
    model: '_id',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

cuentaSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});


module.exports = mongoose.model('Cuenta', cuentaSchema);