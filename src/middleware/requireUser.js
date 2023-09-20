import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import { jwtVerifyPromisified } from "../helpers/jwtFuncts.js";
import { User } from "../models/user.js";

const requireUser = catchAsync(async (req, res, next) => {
  console.log(req.headers)
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
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
});

export default requireUser;
