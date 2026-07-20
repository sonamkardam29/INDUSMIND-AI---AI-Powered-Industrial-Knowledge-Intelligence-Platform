import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userName: string;
  userEmail: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true }
);

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
