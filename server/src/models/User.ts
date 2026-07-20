import mongoose, { Schema, Document } from 'mongoose';

export type UserRole =
  | 'Admin'
  | 'Maintenance Engineer'
  | 'Plant Operator'
  | 'Quality Engineer'
  | 'Safety Officer'
  | 'Auditor';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  isVerified: boolean;
  status: 'active' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: [
        'Admin',
        'Maintenance Engineer',
        'Plant Operator',
        'Quality Engineer',
        'Safety Officer',
        'Auditor',
      ],
      default: 'Plant Operator',
    },
    department: { type: String, required: true, default: 'Operations' },
    avatarUrl: { type: String },
    isVerified: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
