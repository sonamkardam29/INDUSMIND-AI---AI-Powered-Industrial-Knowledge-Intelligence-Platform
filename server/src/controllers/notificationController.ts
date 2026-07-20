import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { NotificationModel } from '../models/Notification';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    let notifications = await NotificationModel.find({
      $or: [{ userId: req.user?.id }, { userId: { $exists: false } }],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    if (!notifications || notifications.length === 0) {
      notifications = [
        {
          title: 'Document Expiry Warning',
          message: 'SOP-402 Emergency Shutdown Protocol is due for annual ISO review in 7 days.',
          type: 'warning',
          read: false,
          link: '/documents',
          createdAt: new Date(),
        } as any,
        {
          title: 'Maintenance Alert',
          message: 'Vibration anomaly detected on Compressor C-102 (4.8 mm/s). Maintenance checklist created.',
          type: 'emergency',
          read: false,
          link: '/maintenance',
          createdAt: new Date(Date.now() - 1800000),
        } as any,
        {
          title: 'Audit Report Generated',
          message: 'ISO 9001 Compliance Audit score computed at 96/100. Download PDF available.',
          type: 'success',
          read: true,
          link: '/reports',
          createdAt: new Date(Date.now() - 7200000),
        } as any,
      ];
    }

    return res.json({ notifications });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await NotificationModel.findByIdAndUpdate(id, { read: true }).exec();
    return res.json({ message: 'Notification marked as read.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
