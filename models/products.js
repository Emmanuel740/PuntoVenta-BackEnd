const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
const Cuenta = require('./cuentas');
//const CM = require('./CM');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Por favor ingresa el nombre del producto']
    },
    codigo: {
        type: String,
        unique: true,
        required: [true, 'Por favor ingresa el codigo del producto']
    },
    codigo_cuenta: {
        type: Schema.Types.Number,
        ref: 'Cuenta',

    },
    precio: {
        type: Number,
        required: [true, 'Por favor ingresa el precio del producto']
    },
    categoria: {
        type: Schema.Types.String,
        ref: 'Categoria',
    },
    existencias: {
        type: Number,
        required: [true, 'Por favor ingresa las existencias del producto']
    },
    Status: {
        type: Boolean,
        default: true
    },
    descripcion: {
        type: String,
        required: [true, 'Por favor ingresa una descripcion del producto']

    },
    userid: {
        type: Schema.Types.Number,
        ref: 'User',
    },
    cantidad: {
        type: Number,
        required: [true, 'Por favor ingresa una cantidad']

    }
});

//crea el id autoincrementable 
autoIncrement.initialize(mongoose.connection);
productSchema.plugin(autoIncrement.plugin, {
    model: '_id',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

productSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});


module.exports = mongoose.model('Product', productSchema);