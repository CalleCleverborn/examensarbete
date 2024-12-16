import { Schema, model } from 'mongoose';

interface IUser {
  googleId?: string;
  email: string;
  name?: string;
  subscriptionPlan?: string;
  usedTransformations?: number;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  subscriptionPlan: { type: String, default: "free" },
  usedTransformations: { type: Number, default: 0 }
});

const User = model<IUser>('User', userSchema);
export default User;