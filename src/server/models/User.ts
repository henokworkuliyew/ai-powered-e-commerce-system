import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'USER' | 'ADMIN' | 'MANAGER';
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  emailVerified: { type: Date },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['USER', 'ADMIN', 'MANAGER'], default: 'USER' },
});

// Prevents OverwriteModelError by checking if the model already exists
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
