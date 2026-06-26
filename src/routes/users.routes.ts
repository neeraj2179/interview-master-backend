import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { updateProfileSchema } from './users.schema';

const router = Router();

router.use(authenticate);

router.get('/me', UsersController.getProfile);
router.patch('/me', validate(updateProfileSchema), UsersController.updateProfile);

export default router;
