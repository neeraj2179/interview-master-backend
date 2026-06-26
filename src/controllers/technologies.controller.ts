import { Request, Response, NextFunction } from 'express';
import { TechnologiesService } from '../services/technologies.service';

export class TechnologiesController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TechnologiesService.getAll();
      res.json({ statusCode: 200, message: 'Technologies retrieved', data });
    } catch (e) { next(e); }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TechnologiesService.getBySlug(req.params.slug);
      res.json({ statusCode: 200, message: 'Technology retrieved', data });
    } catch (e) { next(e); }
  }
}
