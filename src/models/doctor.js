const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    patients: {
        type: [Schema.Types.ObjectId],
        required: true
    }
})

module.exports = mongoose.model('doctor', doctorSchema);