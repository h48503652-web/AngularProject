import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listProjects, createProject, updateProject, deleteProject } from '../controllers/projects.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', listProjects);

router.post('/', createProject);

router.patch('/:projectId', updateProject);

router.delete('/:projectId', deleteProject);

export default router;
