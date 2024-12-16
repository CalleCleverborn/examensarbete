import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';


const port = process.env.PORT || 4000;
const mongodbUri = process.env.MONGODB_URI;



if (!mongodbUri) {
  throw new Error("No MongoDB URI found in environment variables");
}


mongoose.connect(mongodbUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB", err));


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend API is running!');
});


app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});