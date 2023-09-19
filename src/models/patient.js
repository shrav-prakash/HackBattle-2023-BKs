import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
        type: String,
        required: true,
      },
      aiDiagnosis: {
        type: String,
        required: true,
      },
      doctor: { type: Schema.Types.ObjectId, required: false },
      anonymous: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
});

// compare passwords
patientSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// hash password before saving
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//omit password when returning
patientSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const Patient = mongoose.model("Patient", patientSchema);
