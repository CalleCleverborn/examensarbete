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
import Plan from '../models/Plan';

const port = process.env.PORT || 4000;
const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("No MongoDB URI found in environment variables");
}

mongoose.connect(mongodbUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB", err));


  async function seedPlans() {
    const count = await Plan.countDocuments();
    if (count === 0) {
      await Plan.insertMany([
        {
          name: "Base",
          price: 0,
          conversionsPerMonth: 5,
          voiceModelLimit: 16,
          downloadTime: 10,
          description: "For hobby use",   
          bulletPoints: [                
            "5 conversions per month",
            "16 voice models",
            "10 minutes download time",
            "Wav download format"
          ]
        },
        {
          name: "Premium",
          price: 12.99,
          conversionsPerMonth: 100,
          voiceModelLimit: 99999,
          downloadTime: 60,
          description: "For more professional use",
          bulletPoints: [
            "100 conversions per month",
            "Access Every Voice Model",
            "60 minutes download time",
            "Wav download format"
          ]
        },
        {
          name: "Enterprise",
          price: 29.99,
          conversionsPerMonth: 99999,
          voiceModelLimit: 99999,
          downloadTime: 99999,
          description: "For studio grade creation",
          bulletPoints: [
            "Unlimited conversions",
            "Access Every Voice Model",
            "Unlimited download time",
            "Wav download format"
          ]
        }
      ]);
      console.log("Plans seeded successfully.");
    } else {
      console.log("Plans already exist. Skipping seeding.");
    }
  }

mongoose.connect(mongodbUri).then(async () => {
  console.log("Connected to MongoDB");
  await seedPlans(); 
})
.catch(err => console.error("Error connecting to MongoDB", err));


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'supersecretkey', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

app.use('/auth', authRouter);
app.use('/api/transformations', transformationsRouter);
app.use('/api/plans', plansRouter);
app.use("/api/stripe", stripeRouter);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
