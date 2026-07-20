import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';
import { UserModel } from '../models/User';
import { DocumentModel } from '../models/Document';
import { ChunkModel } from '../models/Chunk';
import { ChatModel } from '../models/Chat';
import { MaintenanceModel } from '../models/Maintenance';
import { AuditModel } from '../models/Audit';
import { KnowledgeGraphModel } from '../models/KnowledgeGraph';
import { NotificationModel } from '../models/Notification';
import { AuditLogModel } from '../models/AuditLog';

export const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('[INDUSMIND Seed] Connected to MongoDB for seeding...');

    // Clear existing data
    await UserModel.deleteMany({});
    await DocumentModel.deleteMany({});
    await ChunkModel.deleteMany({});
    await ChatModel.deleteMany({});
    await MaintenanceModel.deleteMany({});
    await AuditModel.deleteMany({});
    await KnowledgeGraphModel.deleteMany({});
    await NotificationModel.deleteMany({});
    await AuditLogModel.deleteMany({});

    const passwordHash = await bcrypt.hash('Password123!', 10);

    // Create 6 Enterprise Users covering all required roles
    const users = await UserModel.create([
      { name: 'Marcus Sterling', email: 'admin@indusmind.ai', passwordHash, role: 'Admin', department: 'Executive Architecture' },
      { name: 'Alex Vance', email: 'engineer@indusmind.ai', passwordHash, role: 'Maintenance Engineer', department: 'Maintenance & Reliability' },
      { name: 'Elena Rostova', email: 'operator@indusmind.ai', passwordHash, role: 'Plant Operator', department: 'Plant Operations' },
      { name: 'David Chen', email: 'quality@indusmind.ai', passwordHash, role: 'Quality Engineer', department: 'Quality Control' },
      { name: 'Sarah Connor', email: 'safety@indusmind.ai', passwordHash, role: 'Safety Officer', department: 'EHS & Safety' },
      { name: 'Robert Vance', email: 'auditor@indusmind.ai', passwordHash, role: 'Auditor', department: 'Compliance & Audit' },
    ]);

    console.log(`[INDUSMIND Seed] Created ${users.length} enterprise role users.`);

    // Create Sample Industrial SOPs & Engineering Manuals
    const docs = await DocumentModel.create([
      {
        title: 'Gas Turbine GT-800 SOP-402: Emergency Shutdown Protocol',
        filename: 'SOP-402_GT800_Shutdown.pdf',
        originalName: 'SOP-402_GT800_Shutdown.pdf',
        path: 'uploads/sample_sop402.pdf',
        mimeType: 'application/pdf',
        size: 2450000,
        department: 'Operations',
        equipmentId: 'GT-800',
        category: 'SOP',
        tags: ['Turbine', 'Emergency', 'Shutdown', 'Safety', 'SOP-402'],
        uploadedBy: users[0]._id,
        ocrProcessed: false,
        ocrText: 'Gas Turbine GT-800 Emergency Shutdown Procedure SOP-402...',
        chunkCount: 3,
        complianceScore: 98,
        securityLevel: 'Restricted',
        version: '3.2.0',
      },
      {
        title: 'Refinery Hydro-Cracker Reactor CR-200 Operating & Safety Manual',
        filename: 'Manual_Reactor_CR200.pdf',
        originalName: 'Manual_Reactor_CR200.pdf',
        path: 'uploads/sample_reactor.pdf',
        mimeType: 'application/pdf',
        size: 5120000,
        department: 'Refining',
        equipmentId: 'CR-200',
        category: 'Manual',
        tags: ['Reactor', 'Refining', 'Pressure Vessel', 'OSHA 1910'],
        uploadedBy: users[1]._id,
        ocrProcessed: true,
        ocrText: 'Refinery Hydro-Cracker Manual RM-701 Operating parameters max temperature 425C...',
        chunkCount: 3,
        complianceScore: 95,
        securityLevel: 'Confidential',
        version: '2.1.0',
      },
      {
        title: 'Centrifugal Compressor C-102 Inspection & Vibration Troubleshooting Log',
        filename: 'Log_Compressor_C102.pdf',
        originalName: 'Log_Compressor_C102.pdf',
        path: 'uploads/sample_compressor.pdf',
        mimeType: 'application/pdf',
        size: 1840000,
        department: 'Maintenance',
        equipmentId: 'C-102',
        category: 'Maintenance',
        tags: ['Compressor', 'Vibration', 'Bearing', 'Lube Oil'],
        uploadedBy: users[1]._id,
        ocrProcessed: false,
        ocrText: 'Centrifugal Compressor C-102 Vibration peak velocity > 4.5 mm/s RMS...',
        chunkCount: 3,
        complianceScore: 92,
        securityLevel: 'Internal',
        version: '1.4.0',
      },
      {
        title: 'OSHA 1910 & ISO 45001 Plant EHS Safety Audit Standard',
        filename: 'EHS_Safety_Standard_2026.pdf',
        originalName: 'EHS_Safety_Standard_2026.pdf',
        path: 'uploads/sample_ehs.pdf',
        mimeType: 'application/pdf',
        size: 3200000,
        department: 'Safety & EHS',
        equipmentId: 'PLANT-WIDE',
        category: 'Safety',
        tags: ['OSHA', 'ISO 45001', 'Safety', 'Audit', 'LOTO'],
        uploadedBy: users[4]._id,
        ocrProcessed: true,
        ocrText: 'OSHA 1910 Process Safety Management Lock-Out Tag-Out Standard...',
        chunkCount: 2,
        complianceScore: 99,
        securityLevel: 'Public',
        version: '4.0.0',
      },
    ]);

    console.log(`[INDUSMIND Seed] Created ${docs.length} industrial documents.`);

    // Seed Vector Chunks for Instant Precision RAG
    const chunks = await ChunkModel.create([
      {
        documentId: docs[0]._id,
        documentTitle: docs[0].title,
        pageNumber: 4,
        chunkIndex: 0,
        content: `Standard Operating Procedure SOP-402 Section 3.2: Emergency Shutdown Sequence for Gas Turbine GT-800.
Step 1: Depress Emergency Fuel Shut-off Switch (ES-101) on Control Console B.
Step 2: Confirm immediate trip of main gas supply valve V-402 and automatic opening of high-pressure blowdown line (BD-9).
Step 3: Execute nitrogen purge sequence for 15 minutes to vent residual combustor hydrocarbons.
Step 4: Keep auxiliary lube oil pump (LOP-2) running for 4 hours post-shutdown to maintain bearing temperature below 50°C.
Step 5: Notify Plant Supervisor and Safety Officer via Emergency Line Ext. 400.`,
        metadata: { department: 'Operations', equipmentId: 'GT-800', category: 'SOP' },
      },
      {
        documentId: docs[1]._id,
        documentTitle: docs[1].title,
        pageNumber: 12,
        chunkIndex: 0,
        content: `Refinery Hydro-Cracker Reactor CR-200 Section 5.1 Thermal & Pressure Operating Limits:
- Normal Operating Core Temperature: 380°C to 410°C (Max Critical Threshold: 425°C).
- Operating Pressure: 135 bar (Relief Valve RV-202 trips at 145 bar gauge).
- Quench Gas Injection: If catalyst bed delta-T exceeds +5°C/min, inject chilled hydrogen quench gas at 25 m³/hr rate immediately.`,
        metadata: { department: 'Refining', equipmentId: 'CR-200', category: 'Manual' },
      },
      {
        documentId: docs[2]._id,
        documentTitle: docs[2].title,
        pageNumber: 2,
        chunkIndex: 0,
        content: `Centrifugal Compressor C-102 Maintenance & Failure Diagnostics:
- Radial Vibration Limit: Peak velocity > 4.5 mm/s RMS indicates severe inner-race roller bearing fatigue (SKF 6220-C3).
- Action Required: Lock-Out/Tag-Out (LOTO) per OSHA 1910.147. Drain ISO VG 46 synthetic lube oil, replace drive-end bearing, and re-align shaft to within 0.02 mm laser tolerance.`,
        metadata: { department: 'Maintenance', equipmentId: 'C-102', category: 'Maintenance' },
      },
      {
        documentId: docs[3]._id,
        documentTitle: docs[3].title,
        pageNumber: 8,
        chunkIndex: 0,
        content: `EHS Safety & Compliance Standard OSHA 1910.147:
- All energy isolating devices must accept a physical padlock and standardized warning tag.
- Zero-energy state must be verified using calibrated multimeter or pressure bleed valve prior to maintenance entry.
- Mandatory annual refresher training required for all plant technicians.`,
        metadata: { department: 'Safety & EHS', equipmentId: 'PLANT-WIDE', category: 'Safety' },
      },
    ]);

    console.log(`[INDUSMIND Seed] Created ${chunks.length} high-precision RAG vector chunks.`);

    // Seed Initial Knowledge Graph
    await KnowledgeGraphModel.create({
      nodes: [
        { id: 'dept-maint', label: 'Maintenance & Reliability', type: 'Department', category: 'Operations' },
        { id: 'dept-safety', label: 'Safety & EHS', type: 'Department', category: 'Compliance' },
        { id: 'equip-gt800', label: 'Gas Turbine GT-800', type: 'Equipment', category: 'Power Gen', details: '35MW Gas Turbine' },
        { id: 'equip-c102', label: 'Compressor C-102', type: 'Equipment', category: 'Pressurization', details: 'Centrifugal Gas Compressor' },
        { id: 'sop-402', label: 'SOP-402 Emergency Shutdown', type: 'SOP', details: 'Mandatory Emergency Protocol' },
        { id: 'inc-2025-09', label: 'Incident #2025-09: Overheating', type: 'Incident', details: 'Bearing temperature >95°C' },
        { id: 'fail-bearing', label: 'Bearing Inner Race Fatigue', type: 'Failure', details: 'Vibration 4.8 mm/s' },
      ],
      edges: [
        { id: 'e1', source: 'dept-maint', target: 'equip-gt800', relation: 'MANAGES', weight: 2 },
        { id: 'e2', source: 'equip-gt800', target: 'sop-402', relation: 'GOVERNED_BY', weight: 3 },
        { id: 'e3', source: 'equip-c102', target: 'inc-2025-09', relation: 'EXP_INCIDENT', weight: 2 },
        { id: 'e4', source: 'inc-2025-09', target: 'fail-bearing', relation: 'CAUSED_BY', weight: 3 },
      ],
    });

    console.log('[INDUSMIND Seed] Seeded initial Knowledge Graph network.');

    // Seed Sample Audit Logs
    await AuditLogModel.create([
      {
        userName: 'Alex Vance',
        userEmail: 'engineer@indusmind.ai',
        role: 'Maintenance Engineer',
        action: 'DOCUMENT_UPLOAD',
        details: 'Uploaded Gas Turbine GT-800 SOP-402 Manual',
        ipAddress: '192.168.1.45',
      },
      {
        userName: 'Sarah Connor',
        userEmail: 'safety@indusmind.ai',
        role: 'Safety Officer',
        action: 'COMPLIANCE_RUN',
        details: 'Executed ISO 9001 Compliance Audit for Operations',
        ipAddress: '192.168.1.88',
      },
    ]);

    console.log('[INDUSMIND Seed] Database seeding completed successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('[INDUSMIND Seed Error]:', err);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}
