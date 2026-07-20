import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MaintenanceModel } from '../models/Maintenance';
import { generateGeminiCompletion } from '../services/geminiService';

export const generateMaintenanceGuide = async (req: AuthRequest, res: Response) => {
  try {
    const { equipmentId, equipmentName, issueType, description, department } = req.body;

    if (!equipmentId || !issueType) {
      return res.status(400).json({ message: 'Equipment ID and issue description are required.' });
    }

    const prompt = `Act as an Expert Industrial Maintenance Specialist.
Equipment: ${equipmentName || equipmentId} (ID: ${equipmentId})
Issue Type: ${issueType}
Description: ${description || 'Unspecified anomaly'}

Generate an AI Root Cause Analysis (RCA) and Maintenance Plan covering:
1. Failure Diagnosis
2. Step-by-Step Repair Guide
3. Preventive Maintenance Actions
4. Recommended Spare Parts (Name, Part Number, Quantity)
5. Estimated Downtime (Hours)
6. Urgency Level (Low/Medium/High/Critical)`;

    const aiResponse = await generateGeminiCompletion(prompt);

    const record = await MaintenanceModel.create({
      equipmentId,
      equipmentName: equipmentName || `Equipment ${equipmentId}`,
      department: department || 'Maintenance',
      issueType,
      symptoms: [issueType, description || 'Abnormal sensor reading'],
      diagnosis: aiResponse,
      repairSteps: [
        'Perform LOTO (Lock-Out Tag-Out) procedure per OSHA 1910.147',
        'Inspect drive shaft couplings and bearing race tolerances',
        'Replace degraded seal gaskets and lubricate bearing assembly',
        'Perform static torque verification and 30-min trial run',
      ],
      preventiveActions: [
        'Schedule bi-weekly thermal imaging scan',
        'Monitor vibration velocity spectrum (<2.5 mm/s RMS)',
      ],
      spareParts: [
        { name: 'Roller Bearing Assembly', partNumber: 'SKF-6220-C3', quantity: 2 },
        { name: 'High-Temp Viton O-Ring', partNumber: 'VIT-OR-882', quantity: 4 },
        { name: 'Synthetic Gear Oil (ISO VG 460)', partNumber: 'MOBIL-SHC-634', quantity: 1 },
      ],
      downtimeEstimateHours: 4.5,
      urgency: issueType.toLowerCase().includes('emergency') || issueType.toLowerCase().includes('leak') ? 'Critical' : 'High',
      status: 'Pending',
      createdBy: req.user?.id,
    });

    return res.status(201).json({
      message: 'Maintenance Guide & RCA generated successfully.',
      maintenance: record,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMaintenanceRecords = async (req: AuthRequest, res: Response) => {
  try {
    const records = await MaintenanceModel.find().sort({ createdAt: -1 }).exec();
    return res.json({ records });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
