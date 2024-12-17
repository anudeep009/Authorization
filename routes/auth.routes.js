import { Router } from "express";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

// Rate limit middleware applied to all routes
router.use(rateLimiter);

//authentication-routes
router.post("/signup", signUp);
router.post("/signin", signIn);

// Forgot & Reset Password Route
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;