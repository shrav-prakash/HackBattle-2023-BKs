import { Doctor } from "../models/doctor";
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
  await patient.save();
  const token = jwt.sign(
    { id: patient._id, email, name: patient.name, userType: "patient" },
    envHandler("JWTSecret"),
    {
      expiresIn: "12h",
    }
  );
  return res.status(201).json({ patient: patient.toJSON(), token });
});

export const loginPatient = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email exists
  const patient = Patient.findOne({ email: email });
  if (!patient) {
    return res.status(400).json({ message: "Email not found" });
  }
  // check if password is correct
  if (!(await patient.comparePassword(password))) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign(
    { id: patient._id, email, name: patient.name, userType: "patient" },
    envHandler("JWTSecret"),
    {
      expiresIn: "12h",
    }
  );
  return res.status(200).json({ patient: patient.toJSON(), token });
});

export const registerDoctor = catchAsync(async (req, res, next) => {
  const { email, name, password, medicalField, consultationFee, license } =
    req.body;
  // check if email already exists
  if (await Doctor.findOne({ email: email })) {
    return res.status(400).json({ message: "Email already exists" });
  }
  // create new doctor
  const doctor = new Doctor({
    email,
    name,
    password,
    medicalField,
    consultationFee,
    license,
  });
  await doctor.save();
  const token = jwt.sign(
    { id: doctor._id, email, name: doctor.name, userType: "doctor" },
    envHandler("JWTSecret"),
    {
      expiresIn: "12h",
    }
  );
  return res.status(201).json({ doctor: doctor.toJSON(), token });
});

export const loginDoctor = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email exists
  const doctor = Doctor.findOne({ email: email });
  if (!doctor) {
    return res.status(400).json({ message: "Email not found" });
  }
  // check if password is correct
  if (!(await doctor.comparePassword(password))) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign(
    { id: doctor._id, email, name: doctor.name, userType: "doctor" },
    envHandler("JWTSecret"),
    {
      expiresIn: "12h",
    }
  );
  return res.status(200).json({ doctor: doctor.toJSON(), token });
});
