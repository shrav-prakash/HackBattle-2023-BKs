import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
});

// compare passwords
doctorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// hash password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//omit password when returning
doctorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
