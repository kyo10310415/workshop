import { Router } from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/userController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, requireAdmin, getUsers);
router.post('/', authenticate, requireAdmin, createUser);
router.delete('/:id', authenticate, requireAdmin, deleteUser);

export default router;
