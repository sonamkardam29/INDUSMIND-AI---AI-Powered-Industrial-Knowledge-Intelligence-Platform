export type UserRole =
  | 'Admin'
  | 'Maintenance Engineer'
  | 'Plant Operator'
  | 'Quality Engineer'
  | 'Safety Officer'
  | 'Auditor';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
}

export interface IDocument {
  _id: string;
  title: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  department: string;
  equipmentId?: string;
  category: 'SOP' | 'Manual' | 'Maintenance' | 'Inspection' | 'Incident' | 'Audit' | 'Safety' | 'General';
  tags: string[];
  ocrProcessed: boolean;
  chunkCount: number;
  complianceScore: number;
  securityLevel: 'Public' | 'Internal' | 'Restricted' | 'Confidential';
  version: string;
  createdAt: string;
}

export interface ICitation {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  snippet: string;
  similarity: number;
}

export interface IMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  confidenceScore?: number;
  citations?: ICitation[];
  sourceDocs?: string[];
  pageNumbers?: number[];
  relatedDocs?: string[];
  timestamp: string;
  isBookmarked?: boolean;
}

export interface IChat {
  _id: string;
  title: string;
  department?: string;
  messages: IMessage[];
  createdAt: string;
}

export interface IMaintenanceRecord {
  _id: string;
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
  createdAt: string;
}

export interface IAuditRecord {
  _id: string;
  title: string;
  department: string;
  standard: string;
  complianceScore: number;
  missingSOPs: string[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  findings: Array<{ category: string; description: string; status: 'Compliant' | 'Non-Compliant' | 'Warning' }>;
  recommendations: string[];
  status: string;
  createdAt: string;
}

export interface IKGNode {
  id: string;
  label: string;
  type: 'Equipment' | 'Department' | 'Machine' | 'Process' | 'Incident' | 'SOP' | 'Failure';
  category?: string;
  details?: string;
}

export interface IKGEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  weight?: number;
}

export interface INotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'success';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface IAuditLogItem {
  userName: string;
  userEmail: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}
