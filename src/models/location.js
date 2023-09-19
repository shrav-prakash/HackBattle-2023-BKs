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
        return v.length <= 2 && (v.includes("male") || v.includes("female"));
      },
      message: (props) => `${props.value} is not a valid Gender!`,
    },
    default: ["Male", "Female"],
  },
});

export const Location = mongoose.model("Location", locationSchema);
