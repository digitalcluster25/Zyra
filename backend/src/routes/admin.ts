import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Все admin routes требуют аутентификации и роли admin
router.use(authenticate);
router.use(requireRole('admin'));

// Users
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/activate', adminController.activateUser);
router.patch('/users/:id/deactivate', adminController.deactivateUser);

// Factors
router.get('/factors', adminController.getFactors);
router.post('/factors', adminController.createFactor);
router.put('/factors/:id', adminController.updateFactor);
router.delete('/factors/:id', adminController.deleteFactor);

export default router;

