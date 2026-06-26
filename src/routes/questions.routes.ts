import { Router } from 'express';
import { QuestionsController } from '../controllers/questions.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { getQuestionsSchema } from './questions.schema';

const router = Router();

// Public routes

router.get('/', validate(getQuestionsSchema), QuestionsController.getAll);
router.get('/:id', QuestionsController.getById);

export default router;
