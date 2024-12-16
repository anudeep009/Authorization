import { Router } from "express";
import { signUp } from "../controllers/auth.controller.js";

const router = Router();

//authentication-routes
router.post("/signup", signUp);

export default router;