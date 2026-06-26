import { Response, NextFunction } from 'express';
import { AttemptsService } from '../services/attempts.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AttemptsController {
  static async submit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttemptsService.submit(req.user!.sub, req.body);
      res.status(201).json({ statusCode: 201, message: 'Attempt submitted', data });
    } catch (e) { next(e); }
  }

  static async getMyAttempts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttemptsService.getMyAttempts(req.user!.sub);
      res.json({ statusCode: 200, message: 'Attempts retrieved', data });
    } catch (e) { next(e); }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AttemptsService.getById(req.user!.sub, req.params.id);
      res.json({ statusCode: 200, message: 'Attempt details retrieved', data });
    } catch (e) { next(e); }
  }
}
