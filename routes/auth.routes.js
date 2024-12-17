import { Router } from "express";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import logger from "../utils/logger.js";

const router = Router();

// Log all requests to this router
router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
  });
  next();
});

// Rate limit middleware applied to all routes
router.use(rateLimiter);
logger.info("Rate limiter middleware applied.");

// Authentication routes
router.post(
  "/signup",
  (req, res, next) => {
    logger.info("Sign-up route accessed.");
    next();
  },
  signUp
);

router.post(
  "/signin",
  (req, res, next) => {
    logger.info("Sign-in route accessed.");
    next();
  },
  signIn
);

// Forgot & Reset Password routes
router.post(
  "/forgot-password",
  (req, res, next) => {
    logger.info("Forgot-password route accessed.");
    next();
  },
  forgotPassword
);

router.post(
  "/reset-password",
  (req, res, next) => {
    logger.info("Reset-password route accessed.");
    next();
  },
  resetPassword
);

export default router;
