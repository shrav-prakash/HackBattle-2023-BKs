import { User } from "../models/user";
import jwt from "jsonwebtoken";

export const register = catchAsync(async (req, res, next) => {
  const { email, name, password, regno } = req.body;
  // check if email already exists
  if (await User.findOne({ email: email })) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const user = new User({
    email,
    name,
    password,
    regno,
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
  const user = User.findOne({ email: email });
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
