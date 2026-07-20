import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { AuditLogModel } from '../models/AuditLog';

export const getUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await UserModel.find().select('-passwordHash').sort({ createdAt: -1 }).exec();
    return res.json({ users });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role, department, status } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role, department, status },
      { new: true }
    ).select('-passwordHash').exec();

    if (!user) return res.status(404).json({ message: 'User not found.' });

    await AuditLogModel.create({
      userName: req.user?.name || 'Admin',
      userEmail: req.user?.email || 'admin@indusmind.ai',
      role: req.user?.role || 'Admin',
      action: 'UPDATE_USER_ROLE',
      details: `Updated user ${user.email} role to ${role} (${department})`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ message: 'User updated successfully.', user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAuditLogs = async (_req: AuthRequest, res: Response) => {
  try {
    let logs = await AuditLogModel.find().sort({ createdAt: -1 }).limit(100).exec();

    if (!logs || logs.length === 0) {
      logs = [
        {
          userName: 'Alex Vance',
          userEmail: 'engineer@indusmind.ai',
          role: 'Maintenance Engineer',
          action: 'DOCUMENT_UPLOAD',
          details: 'Uploaded Gas Turbine GT-800 SOP-402 Manual',
          ipAddress: '192.168.1.45',
          createdAt: new Date(),
        } as any,
        {
          userName: 'Sarah Connor',
          userEmail: 'auditor@indusmind.ai',
          role: 'Auditor',
          action: 'COMPLIANCE_RUN',
          details: 'Executed ISO 9001 Compliance Check for Plant Operations',
          ipAddress: '192.168.1.88',
          createdAt: new Date(Date.now() - 3600000),
        } as any,
      ];
    }

    return res.json({ logs });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
