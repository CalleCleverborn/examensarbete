import mongoose, { Schema, Document } from "mongoose";

export interface ITransformation extends Document {
  userId: string;
  voiceModelId: number;
  jobId: string;
  status: string;
  jobStartTime: Date;
  jobEndTime?: Date;
  originalFileUrl?: string; 
  outputFileUrl?: string;
}

const TransformationSchema = new Schema<ITransformation>({
  userId: { type: String, required: true },
  voiceModelId: { type: Number, required: true },
  jobId: { type: String, required: true },
  status: { type: String, required: true },
  jobStartTime: { type: Date, default: Date.now },
  jobEndTime: { type: Date },
  originalFileUrl: { type: String, required: false }, 
  outputFileUrl: { type: String },
});

export default mongoose.model<ITransformation>("Transformation", TransformationSchema);
