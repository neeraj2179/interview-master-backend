import { Request, Response, NextFunction } from 'express';
import { TopicsService } from '../services/topics.service';

export class TopicsController {
  static async getByTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TopicsService.getByTechnology(req.params.technologySlug);
      res.json({ statusCode: 200, message: 'Topics retrieved', data });
    } catch (e) { next(e); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TopicsService.getById(req.params.id);
      res.json({ statusCode: 200, message: 'Topic retrieved', data });
    } catch (e) { next(e); }
  }

  static async getBySlugs(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TopicsService.getBySlugs(req.params.techSlug, req.params.topicSlug);
      res.json({ statusCode: 200, message: 'Topic retrieved', data });
    } catch (e) { next(e); }
  }
}
