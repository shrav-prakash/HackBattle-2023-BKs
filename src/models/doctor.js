const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  medicalField: {
    type: String,
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
    min: 0,
  },
  license: {
    type: String,
    required: true,
  },
  rating: {
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
});

module.exports = mongoose.model("doctor", doctorSchema);
