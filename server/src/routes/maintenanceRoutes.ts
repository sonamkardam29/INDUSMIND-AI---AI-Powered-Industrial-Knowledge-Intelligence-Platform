import { Router } from 'express';
import { generateMaintenanceGuide, getMaintenanceRecords } from '../controllers/maintenanceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/generate', authenticateToken, generateMaintenanceGuide);
router.get('/', authenticateToken, getMaintenanceRecords);

export default router;
