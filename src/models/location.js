import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  accessibleGender: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v == "Male" || v == "Female";
      },
      message: (props) => `${props.value} is not a valid Gender!`,
    },
    default: ["Male", "Female"],
  },
});

export const User = mongoose.model("Location", locationSchema);
