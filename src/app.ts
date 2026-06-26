import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import technologiesRoutes from './routes/technologies.routes';
import topicsRoutes from './routes/topics.routes';
import questionsRoutes from './routes/questions.routes';
import testsRoutes from './routes/tests.routes';
import attemptsRoutes from './routes/attempts.routes';
import progressRoutes from './routes/progress.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/technologies', technologiesRoutes);
app.use('/api/v1/topics', topicsRoutes);
app.use('/api/v1/questions', questionsRoutes);
app.use('/api/v1/tests', testsRoutes);
app.use('/api/v1/attempts', attemptsRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorHandler);

export default app;
