const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  medicalHistory: {
    type: String,
    required: true,
  },
  consultation: [
    {
      symptom: {
        type: [String],
        required: true,
      },
      doctor: { type: Schema.Types.ObjectId, required: false },
    },
  ],
});

module.exports = mongoose.model("patient", patientSchema);
