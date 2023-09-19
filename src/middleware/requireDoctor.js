import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import { jwtVerifyPromisified } from "../helpers/jwtFuncs.js";
import { Doctor } from "../models/doctor.js";

const requireDoctor = catchAsync(async (req, res, next) => {
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
    // check if doctor exists
    const doctor = await Doctor.findById(decoded.id);
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    req.doctor = doctor;
    next();
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
});

export default requireDoctor;
