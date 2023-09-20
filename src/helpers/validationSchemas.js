import Joi from "joi";
import { parsePhoneNumber } from "libphonenumber-js";

export const authorizationHeaderSchema = Joi.object({
  authorization: Joi.string().required(),
})
  .required()
  .unknown(true);

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  // reg no is 2 numbers followed by 3 letters followed by 4 numbers
  regno: Joi.string()
    .required()
    .pattern(new RegExp("^[0-9]{2}[a-zA-Z]{3}[0-9]{4}$")),
  // validate phone number using libphonenumberjs
  phone: Joi.string()
    .required()
    .custom((value, helpers) =>
      parsePhoneNumber(value).isValid() ? value : helpers.error("any.invalid")
    ),
  gender: Joi.string().allow("male", "female").required(),
}).required();

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).required();

export const schedulePickupSchema = Joi.object({
  // UTC timestamp
  pickupMaxTime: Joi.number().required(),
  pickupLocationId: Joi.string().required().hex().length(24),
  deliverLocationId: Joi.string().required().hex().length(24),
}).required();

export const acceptPickupSchema = Joi.object({
  pickupId: Joi.string().required().hex().length(24),
}).required();

export const completePickupSchema = Joi.object({
  pickupId: Joi.string().required().hex().length(24),
  rating: Joi.number().min(0).max(5).required(),
}).required();

export const cancelPickupSchema = Joi.object({
  pickupId: Joi.string().required().hex().length(24),
}).required();
