import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from './src/auth/passport'
import authRouter from './src/routes/auth'

const port = process.env.PORT || 4000;
const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("No MongoDB URI found in environment variables");
}

mongoose.connect(mongodbUri)
  .then(() => console.log("Connected to MongoDB"))
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
  cookie: { secure: true}
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Backend listening on localhost:${port}`);
});
