import catchAsync from "../helpers/catchAsync.js";
import envHandler from "../helpers/envHandler.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const register = catchAsync(async (req, res, next) => {
  const { email, name, password, regno, phone, gender } = req.body;
  // check if email already exists
  if (await User.findOne({ email: email })) {
    return res.status(400).json({ message: "Email already exists" });
  }
  // check if regno already exists
  if (await User.findOne({ regno: regno })) {
    return res
      .status(400)
      .json({ message: "Registration number already exists" });
  }

  const user = new User({
    email,
    name,
    password,
    regno,
    phone,
    gender,
  });
  await user.save();
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    envHandler("JWTSecret"),
    {
      expiresIn: "12h",
    }
  );
  return res.status(201).json({ user: user.toJSON(), token });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email exists
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(400).json({ message: "Email not found" });
  }
  // check if password is correct
  if (!(await user.comparePassword(password))) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign(
    { id: user._id, email, name: user.name },
    envHandler("JWTSecret"),
    {
      expiresIn: "12h",
    }
  );
  return res.status(200).json({ user: user.toJSON(), token });
});
