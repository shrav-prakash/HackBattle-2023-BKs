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
  pickupFrom: {
    type: locationSchema,
    required: true,
  },
  deliverTo: {
    type: locationSchema,
    required: true,
  },
  pickupTime: {
    scheduled: {
      type: Date,
      required: true,
    },
    maximum: {
      type: Date,
      required: true,
    },
  },
});

export const Pickup = mongoose.model("Pickup", pickupSchema);
