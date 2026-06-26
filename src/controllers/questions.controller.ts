import { Request, Response, NextFunction } from 'express';
import { QuestionsService } from '../services/questions.service';

export class QuestionsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await QuestionsService.getAll(req.query);
      res.json({ statusCode: 200, message: 'Questions retrieved', data });
    } catch (e) { next(e); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await QuestionsService.getById(req.params.id);
      res.json({ statusCode: 200, message: 'Question retrieved', data });
    } catch (e) { next(e); }
  }
}
