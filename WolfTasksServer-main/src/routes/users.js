import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listUsers } from '../controllers/users.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listUsers);

export default router;
