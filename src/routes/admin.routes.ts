import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Secure all admin routes
router.use(authenticate, requireAdmin);

router.post('/chat', AdminController.chat);

// Technologies CRUD
router.get('/technologies', AdminController.getTechnologies);
router.post('/technologies', AdminController.createTechnology);
router.put('/technologies/:id', AdminController.updateTechnology);
router.delete('/technologies/:id', AdminController.deleteTechnology);

// Topics CRUD
router.get('/topics', AdminController.getTopics);
router.post('/topics', AdminController.createTopic);
router.put('/topics/:id', AdminController.updateTopic);
router.delete('/topics/:id', AdminController.deleteTopic);

// Tests CRUD
router.get('/tests', AdminController.getTests);
router.post('/tests', AdminController.createTest);
router.put('/tests/:id', AdminController.updateTest);
router.delete('/tests/:id', AdminController.deleteTest);

// Questions CRUD
router.get('/questions', AdminController.getQuestions);
router.post('/questions', AdminController.createQuestion);
router.put('/questions/:id', AdminController.updateQuestion);
router.delete('/questions/:id', AdminController.deleteQuestion);

// Users CRUD
router.get('/users', AdminController.getUsers);
router.put('/users/:id/status', AdminController.toggleUserStatus);

export default router;
