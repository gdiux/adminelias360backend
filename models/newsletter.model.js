const { Schema, model } = require('mongoose');

const newsletterSchema = Schema({

    email: {
        type: String,
        require: true,
    },

    name: {
        type: String,
    },

    status: {
        type: Boolean,
        default: true
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

newsletterSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.nelid = _id;
    return object;

});

module.exports = model('Newsletter', newsletterSchema);