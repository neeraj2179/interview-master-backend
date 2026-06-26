import { Router } from 'express';
import { TestsController } from '../controllers/tests.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes

router.get('/', TestsController.getAll);
router.get('/:id', TestsController.getById);

export default router;
