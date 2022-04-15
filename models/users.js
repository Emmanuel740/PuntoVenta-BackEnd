const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
const Cuenta = require('./cuentas');
//const CM = require('./CM');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Por favor ingresa el nombre del usuario']
    },
    rol: {
        type: String,
        required: [true, 'Por favor ingresa el rol del Usuario']
    },
    cuentas: [{
        codigo_cuenta: {
            type: Schema.Types.Number,
            ref: 'Cuenta',

        }

    }],
    telefono: {
        type: Number,
    },
    userName: {
        type: String,
        unique: true,
        required: [true, 'Por favor ingresa el User Name']
    },
    password: {
        type: String,
        unique: true,
        required: [true, 'Por favor ingresa la contraseña']
    },
    Status: {
        type: Boolean,
        default: false
    }
});

//crea el id autoincrementable 
autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, {
    model: '_id',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

userSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});


module.exports = mongoose.model('User', userSchema);