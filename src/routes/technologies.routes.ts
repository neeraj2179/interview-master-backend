import { Router } from 'express';
import { TechnologiesController } from '../controllers/technologies.controller';

const router = Router();

router.get('/', TechnologiesController.getAll);
router.get('/:slug', TechnologiesController.getBySlug);

export default router;
