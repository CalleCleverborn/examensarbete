import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from './auth/passport';
import plansRouter from './routes/plans';
import authRouter from './routes/auth';
import transformationsRouter from './routes/transformations';
import stripeRouter from './routes/stripe';
import { seedPlans } from './scripts/seedPlans'; 

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

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

app.use('/auth', authRouter);
app.use('/api/transformations', transformationsRouter);
app.use('/api/plans', plansRouter);
app.use('/api/stripe', stripeRouter);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
