import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listComments, createComment } from '../controllers/comments.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', listComments);

router.post('/', createComment);

export default router;
