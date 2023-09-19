import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  regno: {
    type: String,
    required: true,
    unique: true,
  },
  pickupRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  completedPickups: {
    type: [
      {
        pickup: {
          type: Schema.Types.ObjectId,
          ref: "Pickup",
        },
        scheduler: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  currentPickups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pickup",
    },
  ],
  scheduledPickups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pickup",
    },
  ],
  requestRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  money: {
    type: Number,
    default: 100,
  },
});

// compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//omit password when returning
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", userSchema);