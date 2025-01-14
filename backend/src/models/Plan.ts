import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: string;                  
  price: number;                 
  conversionsPerMonth: number;   
  voiceModelLimit: number;       
  downloadTime: number;
  description: string;          
  bulletPoints: string[];        
}

const PlanSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  conversionsPerMonth: { type: Number, required: true },
  voiceModelLimit: { type: Number, required: true },
  downloadTime: { type: Number, required: true },
  description: { type: String, default: "" }, 
  bulletPoints: { type: [String], default: [] } 
});

export default mongoose.model<IPlan>("Plan", PlanSchema);
