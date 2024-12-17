import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/user.model.js";

const signUp = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ error: "email and Password is required" });
    //  email-validation
    z.string().email("Invalid email format").parse(email);

    //  password-validation
    z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      )
      .parse(password);

    const userRole = role && role === "admin" ? "admin" : "user";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exists, please log in" });
    }
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({ email, password: hashedPassword, role: userRole });

    return res.status(201).send({ message: "User signed up successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    return res
      .status(500)
      .send({ message: "Error during sign up", error: error.message });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ error: "email and Password is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found. Please sign up." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(200).send({
      message: "Login successfull",
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    return res
      .status(500)
      .send({ message: "Error during sign in", error: error.message });
  }
};

export { signUp, signIn };
