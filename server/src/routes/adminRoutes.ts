import { Router } from 'express';
import { getUsers, updateUserRole, getAuditLogs } from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/users', authenticateToken, requireRole(['Admin']), getUsers);
router.put('/user-role', authenticateToken, requireRole(['Admin']), updateUserRole);
router.get('/logs', authenticateToken, requireRole(['Admin', 'Auditor']), getAuditLogs);

export default router;
