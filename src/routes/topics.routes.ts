import { Router } from 'express';
import { TopicsController } from '../controllers/topics.controller';

const router = Router();

router.get('/by-technology/:technologySlug', TopicsController.getByTechnology);
router.get('/:techSlug/:topicSlug', TopicsController.getBySlugs);
router.get('/:id', TopicsController.getById);

export default router;
