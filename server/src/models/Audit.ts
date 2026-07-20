import mongoose, { Schema, Document } from 'mongoose';

export interface IAudit extends Document {
  title: string;
  department: string;
  auditorId: mongoose.Types.ObjectId | string;
  standard: 'ISO 9001' | 'OSHA 1910' | 'ISO 45001' | 'ISO 14001' | 'API 570';
  complianceScore: number;
  missingSOPs: string[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  findings: Array<{ category: string; description: string; status: 'Compliant' | 'Non-Compliant' | 'Warning' }>;
  recommendations: string[];
  status: 'Draft' | 'Completed' | 'Under Review';
  createdAt: Date;
  updatedAt: Date;
}

const AuditSchema = new Schema<IAudit>(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    auditorId: { type: Schema.Types.ObjectId, ref: 'User' },
    standard: {
      type: String,
      enum: ['ISO 9001', 'OSHA 1910', 'ISO 45001', 'ISO 14001', 'API 570'],
      required: true,
    },
    complianceScore: { type: Number, required: true, default: 90 },
    missingSOPs: [{ type: String }],
    riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Severe'], default: 'Low' },
    findings: [
      {
        category: { type: String },
        description: { type: String },
        status: { type: String, enum: ['Compliant', 'Non-Compliant', 'Warning'] },
      },
    ],
    recommendations: [{ type: String }],
    status: { type: String, enum: ['Draft', 'Completed', 'Under Review'], default: 'Completed' },
  },
  { timestamps: true }
);

export const AuditModel = mongoose.model<IAudit>('Audit', AuditSchema);
