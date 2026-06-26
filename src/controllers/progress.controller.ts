import { Response, NextFunction } from 'express';
import { ProgressService } from '../services/progress.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ProgressController {
  static async getMyProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await ProgressService.getMyProgress(req.user!.sub);
      res.json({ statusCode: 200, message: 'Progress retrieved', data });
    } catch (e) { next(e); }
  }
}
