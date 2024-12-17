import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/auth.routes.js";
import helmet from "helmet";
import xssClean from "xss-clean";
import csurf from "csurf";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// ------------------ Middlewares ------------------

// security headers helmet
app.use(helmet());

// Body parser
app.use(express.json({ limit: "16kb" }));

// Prevent XSS attacks
app.use(xssClean());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// CSRF Protection
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Connect to the database
connectDB();

// ------------------ Routes ------------------

// User authentication routes
app.use("/api/v1/user", userRoutes);

// CSRF Token route for client-side use
app.get("/api/v1/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Root route
app.get("/", (req, res) => {
  res.send("Server running with security features enabled.");
});

// ------------------ Server ------------------
app.listen(port, () => {
  console.log(`Access at: http://localhost:${port}`);
});
