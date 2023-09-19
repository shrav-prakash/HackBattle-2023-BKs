import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import { jwtVerifyPromisified } from "../helpers/jwtFuncs.js";
import { Patient } from "../models/patient.js";

const requirePatient = catchAsync(async (req, res, next) => {
  let authorizationHeader = req.headers.authorization;
  let token;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer"))
    token = authorizationHeader.split(" ")[1];

  if (!token)
    return res.status(400).json({
      error:
        "User is not logged in or Login session has expired. Please Login again.",
    });

  try {
    const decoded = await jwtVerifyPromisified(token, envHandler("JWTSecret"));
    // check if patient exists
    const patient = await Patient.findById(decoded.id);
    if (!patient) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    req.patient = patient;
    next();
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
});

export default requirePatient;
