const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
//const Areas = require('./areas');
//const CM = require('./CM');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Por favor ingresa el nombre de la categoria']
    },
    userid: {
        type: Schema.Types.Number,
        ref: 'User',
    },
    codigo_cuenta: {
        type: Schema.Types.Number,
        ref: 'Cuenta',

    },
    Status: {
        type: Boolean,
        default: true
    }
});

//crea el id autoincrementable 
autoIncrement.initialize(mongoose.connection);
categorySchema.plugin(autoIncrement.plugin, {
    model: '_id',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

categorySchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});


module.exports = mongoose.model('Category', categorySchema);