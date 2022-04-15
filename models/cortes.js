const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
//const Areas = require('./areas');
//const CM = require('./CM');

let Schema = mongoose.Schema;

let corteSchema = new Schema({
    userid: {
        type: Schema.Types.Number,
        ref: 'User',
    },
    fechaCorte: {
        type: Date,
        required: [true, 'Ingresa la fecha'],
    },
    codigo_cuenta: {
        type: Schema.Types.Number,
        ref: 'Cuenta',

    },
    Status: {
        type: Boolean,
        default: true
    },
    ventasCorte: [{
        id: {
            type: Schema.Types.Number,
            ref: 'Venta',
        }
    }],
    total: {
        type: Number,
        required: [true, 'Ingresa el total del corte']
    },
    usuarioCorte: {
        type: Schema.Types.Number,
        ref: 'User',
    }

});

//crea el id autoincrementable 
autoIncrement.initialize(mongoose.connection);
corteSchema.plugin(autoIncrement.plugin, {
    model: '_id',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

corteSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});


module.exports = mongoose.model('Corte', corteSchema);