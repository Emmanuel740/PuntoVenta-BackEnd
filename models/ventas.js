const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
const Cuenta = require('./cuentas');
//const CM = require('./CM');

let Schema = mongoose.Schema;

let ventaSchema = new Schema({
    productos: [{
        producto: {
            type: Schema.Types.Number,
            ref: 'Product',
        },
        cantidad: {
            type: Number
        }
    }],
    total: {
        type: Number,
        required: [true, 'Por favor ingresa el total de la venta']
    },
    codigo_cuenta: {
        type: Schema.Types.Number,
        ref: 'Cuenta',

    },
    userid: {
        type: Schema.Types.Number,
        ref: 'User',
    },
    fecha: {
        type: Date
    }
});

//crea el id autoincrementable 
autoIncrement.initialize(mongoose.connection);
ventaSchema.plugin(autoIncrement.plugin, {
    model: '_id',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

ventaSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});


module.exports = mongoose.model('Venta', ventaSchema);