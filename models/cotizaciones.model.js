const { Schema, model } = require('mongoose');

const CotizacionesSchema = Schema({

    email: {
        type: String,
        require: true,
    },

    name: {
        type: String,
        require: true
    },

    address: {
        type: String
    },

    phone: {
        type: String
    },

    description: {
        type: String
    },

    status: {
        type: String,
        default: 'Pending'
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

CotizacionesSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.cotid = _id;
    return object;

});

module.exports = model('Cotizaciones', CotizacionesSchema);