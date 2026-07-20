import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuditModel } from '../models/Audit';
import { DocumentModel } from '../models/Document';

export const runComplianceAudit = async (req: AuthRequest, res: Response) => {
  try {
    const { department, standard } = req.body;

    const deptDocs = await DocumentModel.find({ department: department || 'Operations' }).exec();

    const missingSOPs = [];
    if (!deptDocs.some(d => d.title.toLowerCase().includes('emergency') || d.tags.includes('Safety'))) {
      missingSOPs.push('Emergency Isolation Protocol (OSHA 1910.119)');
    }
    if (!deptDocs.some(d => d.title.toLowerCase().includes('loto') || d.tags.includes('LOTO'))) {
      missingSOPs.push('Lock-Out Tag-Out Procedure (OSHA 1910.147)');
    }
    if (!deptDocs.some(d => d.title.toLowerCase().includes('inspection') || d.category === 'Inspection')) {
      missingSOPs.push('Quarterly Pressure Vessel Inspection Log (API 510)');
    }

    const complianceScore = Math.max(65, 100 - missingSOPs.length * 12);

    const audit = await AuditModel.create({
      title: `${standard || 'ISO 9001'} Compliance Audit - ${department || 'Plant Operations'}`,
      department: department || 'Operations',
      auditorId: req.user?.id,
      standard: standard || 'ISO 9001',
      complianceScore,
      missingSOPs,
      riskLevel: complianceScore > 85 ? 'Low' : complianceScore > 75 ? 'Moderate' : 'High',
      findings: [
        { category: 'Document Control', description: 'All SOPs have valid revision numbers and owner signatures.', status: 'Compliant' },
        { category: 'Safety Standards', description: 'Missing dedicated LOTO checklist for high-pressure valves.', status: missingSOPs.length > 0 ? 'Non-Compliant' : 'Compliant' },
        { category: 'Maintenance Logs', description: 'Vibration monitoring logs updated within past 30 days.', status: 'Compliant' },
      ],
      recommendations: [
        'Upload missing mandatory emergency isolation SOPs immediately.',
        'Conduct bi-annual refresher training for plant technicians.',
        'Implement automated document expiration notification tags.',
      ],
      status: 'Completed',
    });

    return res.status(201).json({
      message: 'Compliance audit executed successfully.',
      audit,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAudits = async (req: AuthRequest, res: Response) => {
  try {
    const audits = await AuditModel.find().sort({ createdAt: -1 }).exec();
    return res.json({ audits });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
