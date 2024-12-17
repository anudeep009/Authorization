import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

const signUp = async (req, res) => {
  const { email, password, role } = req.body;
  logger.info("Sign-up attempt.", { email, ip: req.ip });

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
    logger.info("User signed up successfully.", { email });
    return res.status(201).send({ message: "User signed up successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    logger.error("Sign-up failed.", { error: error.message });
    return res
      .status(500)
      .send({ message: "Error during sign up", error: error.message });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  logger.info("Sign-in attempt.", { ip: req.ip });
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
    logger.info("User signed in successfully.", { email });
    return res.status(200).send({
      message: "Login successfull",
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    logger.error("Sign-in failed.", { error: error.message });
    return res
      .status(500)
      .send({ message: "Error during sign in", error: error.message });
  }
};

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};


const sendPasswordResetEmail = (email, token) => {
  // console.log(token);
  const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `Click this link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Password reset email sent:", info.response);
    }
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};


export { signUp, signIn,forgotPassword, resetPassword };
