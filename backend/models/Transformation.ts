import { Schema, model, Types } from 'mongoose';

interface ITransformation {
  userId: Types.ObjectId;
  voiceModelId: number;
  jobId: number;
  status: string;
  createdAt: Date;
  jobStartTime?: Date;
  jobEndTime?: Date;
  originalFileUrl?: string;
}

const transformationSchema = new Schema<ITransformation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  voiceModelId: { type: Number, required: true },
  jobId: { type: Number, required: true },
  status: { type: String, default: 'running' },
  createdAt: { type: Date, default: Date.now },
  jobStartTime: { type: Date },
  jobEndTime: { type: Date },
  originalFileUrl: { type: String }
});

const Transformation = model<ITransformation>('Transformation', transformationSchema);
export default Transformation;
