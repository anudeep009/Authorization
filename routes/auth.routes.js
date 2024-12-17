import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";

const router = Router();

//authentication-routes
router.post("/signup", signUp);
router.post("/signin",signIn);

export default router;