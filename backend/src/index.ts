import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./auth/passport";
import plansRouter from "./routes/plans";
import authRouter from "./routes/auth";
import transformationsRouter from "./routes/transformations";
import stripeRouter from "./routes/stripe";
import { seedPlans } from "./scripts/seedPlans";

const port = process.env.PORT || 4000;
const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("No MongoDB URI found in environment variables");
}

mongoose
  .connect(mongodbUri)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedPlans();
  })
  .catch((err) => console.error("Error connecting to MongoDB", err));

const app = express();

// Viktigt på Render (app kör bakom proxy / load balancer)
app.set("trust proxy", 1);

// CORS – tillåt din frontend på localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// SESSION – hårdkodat för cross-site mellan localhost:5173 och https://examensarbete.onrender.com
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // måste vara true för att SameSite=None ska accepteras i moderna browsers
      secure: true,
      // krävs för att cookie ska skickas från localhost:5173 -> examensarbete.onrender.com i XHR
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

app.use("/auth", authRouter);
app.use("/api/transformations", transformationsRouter);
app.use("/api/plans", plansRouter);
app.use("/api/stripe", stripeRouter);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
