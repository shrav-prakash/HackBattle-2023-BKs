import mongoose from "mongoose";
import { locationSchema } from "./location";

const Schema = mongoose.Schema;

const pickupSchema = new Schema({
  scheduler: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deliverer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: null,
  },
  // sub document location
  pickupFrom: {
    type: locationSchema,
    required: true,
  },
  deliverTo: {
    type: locationSchema,
    required: true,
  },
});

export const User = mongoose.model("Pickup", pickupSchema);
