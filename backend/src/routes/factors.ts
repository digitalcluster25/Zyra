import { Router } from 'express';
import * as factorController from '../controllers/factorController';

const router = Router();

router.get('/', factorController.getFactors);

export default router;

