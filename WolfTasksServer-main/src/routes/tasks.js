import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/tasks.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', listTasks);

router.post('/', createTask);

router.patch('/:id', updateTask);

router.delete('/:id', deleteTask);

export default router;
