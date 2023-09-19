import { Patient } from "../models/patient";
import jwt from "jsonwebtoken";

export const registerPatient = catchAsync(async (req, res, next) => {
  const { email, name, password, weight, dob, height, medicalHistory } =
    req.body;
  // check if email already exists
  if (await Patient.findOne({ email: email })) {
    return res.status(400).json({ message: "Email already exists" });
  }
  // create new patient
  const patient = new Patient({
    email,
    name,
    password,
    weight,
    dob,
    height,
    medicalHistory,
  });
  const token = jwt.sign({ email, name }, envHandler("JWTSecret"), {
    expiresIn: "12h",
  });
  return res.status(201).json({ patient, token });
});
