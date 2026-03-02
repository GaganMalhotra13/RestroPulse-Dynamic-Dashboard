import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// SIGNUP LOGIC
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      role: role || "user", // Default role
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN & COOKIE LOGIC
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    // JWT Generate karo (Secret key .env mein honi chahiye)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    
    // Password hata do response se security ke liye
    delete user.password;

    // HTTP-ONLY COOKIE SET KARO (Gagan, yehi main jaadu hai)
    res.cookie("token", token, {
      httpOnly: true, // XSS attacks se bachata hai
      secure: process.env.NODE_ENV === "production", // Production mein true rakhna
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }).status(200).json({ user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGOUT LOGIC
export const logout = async (req, res) => {
  res.clearCookie("token").status(200).json({ msg: "Logged out successfully" });
};