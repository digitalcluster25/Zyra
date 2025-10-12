import { Router } from 'express';
import * as checkinController from '../controllers/checkinController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Все routes требуют аутентификации
router.use(authenticate);

router.get('/', checkinController.getCheckIns);
router.post('/', checkinController.createCheckIn);
router.get('/stats', checkinController.getStats);
router.post('/import', checkinController.importCheckIns);
router.get('/:id', checkinController.getCheckIn);
router.delete('/:id', checkinController.deleteCheckIn);

export default router;

