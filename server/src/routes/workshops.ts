import { Router } from 'express';
import {
  getWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop
} from '../controllers/workshopController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Public/User routes
router.get('/', authenticate, getWorkshops);
router.get('/:id', authenticate, getWorkshopById);

// Admin routes
router.post('/', authenticate, requireAdmin, createWorkshop);
router.put('/:id', authenticate, requireAdmin, updateWorkshop);
router.delete('/:id', authenticate, requireAdmin, deleteWorkshop);

export default router;
