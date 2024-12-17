import { Router } from "express";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { signUp, signIn } from "../controllers/auth.controller.js";

const router = Router();

// Rate limit middleware applied to all routes
router.use(rateLimiter);

//authentication-routes
router.post("/signup", signUp);
router.post("/signin",signIn);

export default router;