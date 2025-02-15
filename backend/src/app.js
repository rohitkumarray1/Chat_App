import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router.js";
import messageRouter from "./routes/message.router.js";
import { app, server } from "./lib/socket.js";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
