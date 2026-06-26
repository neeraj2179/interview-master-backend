import { Request, Response, NextFunction } from 'express';
import { TestsService } from '../services/tests.service';

export class TestsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TestsService.getAll(req.query.technologyId as string);
      res.json({ statusCode: 200, message: 'Tests retrieved', data });
    } catch (e) { next(e); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TestsService.getById(req.params.id);
      res.json({ statusCode: 200, message: 'Test retrieved', data });
    } catch (e) { next(e); }
  }
}
