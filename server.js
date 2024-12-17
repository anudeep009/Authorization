import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/auth.routes.js";
import helmet from "helmet";
import xssClean from "xss-clean";
import csurf from "csurf";
import logger from "./utils/logger.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// ------------------ Middlewares ------------------

// Log server start
logger.info("Initializing server...");

// security headers helmet
app.use(helmet());
logger.info("Helmet security headers applied.");

// Body parser
app.use(express.json({ limit: "16kb" }));
logger.info("Body parser initialized.");

// Prevent XSS attacks
app.use(xssClean());
logger.info("XSS protection enabled.");

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
logger.info("CORS configured with origin:", process.env.CORS_ORIGIN);

// Cookie parser
app.use(cookieParser());
logger.info("Cookie parser middleware initialized.");

// CSRF Protection
// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);
// logger.info("CSRF protection middleware initialized.");

// Connect to the database
connectDB()
  .then(() => logger.info("Database connected successfully."))
  .catch((error) => logger.error("Database connection failed:", error.message));

// ------------------ Routes ------------------

// User authentication routes
app.use("/api/v1/user", userRoutes);
logger.info("Authentication routes initialized.");

// CSRF Token route
app.get("/api/v1/csrf-token", (req, res) => {
  logger.info("CSRF token requested.");
  res.json({ csrfToken: req.csrfToken() });
});

// Root route
app.get("/", (req, res) => {
  logger.info("Root route accessed.");
  res.send("Server running with security features enabled.");
});

// ------------------ Server ------------------
app.listen(port, () => {
  logger.info(`Server started at: http://localhost:${port}`);
});
