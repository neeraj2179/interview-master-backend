import { Router } from 'express';
import { AttemptsController } from '../controllers/attempts.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { submitAttemptSchema } from './attempts.schema';

const router = Router();

router.use(authenticate);

router.post('/submit', validate(submitAttemptSchema), AttemptsController.submit);
router.get('/my', AttemptsController.getMyAttempts);
router.get('/:id', AttemptsController.getById);

export default router;
