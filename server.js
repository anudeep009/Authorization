import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/auth.routes.js";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "16kb"}));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

connectDB();

//user authentication routes

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`acces at : http://localhost:${port}`);
});
