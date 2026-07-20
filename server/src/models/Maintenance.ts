import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
  equipmentId: string;
  equipmentName: string;
  department: string;
  issueType: string;
  symptoms: string[];
  diagnosis: string;
  repairSteps: string[];
  preventiveActions: string[];
  spareParts: Array<{ name: string; partNumber: string; quantity: number }>;
  downtimeEstimateHours: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed';
  createdBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceSchema = new Schema<IMaintenance>(
  {
    equipmentId: { type: String, required: true },
    equipmentName: { type: String, required: true },
    department: { type: String, required: true },
    issueType: { type: String, required: true },
    symptoms: [{ type: String }],
    diagnosis: { type: String, required: true },
    repairSteps: [{ type: String }],
    preventiveActions: [{ type: String }],
    spareParts: [
      {
        name: { type: String },
        partNumber: { type: String },
        quantity: { type: Number },
      },
    ],
    downtimeEstimateHours: { type: Number, default: 4 },
    urgency: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const MaintenanceModel = mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
