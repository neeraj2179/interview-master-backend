import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
      }

      const data = await AdminService.handleChatCommand(prompt);
      res.json({ statusCode: 200, message: 'Success', data });
    } catch (e) {
      next(e);
    }
  }

  // --- Technologies CRUD ---
  
  static async getTechnologies(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getTechnologies();
      res.json({ statusCode: 200, message: 'Success', data });
    } catch (e) { next(e); }
  }

  static async createTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.createTechnology(req.body);
      res.status(201).json({ statusCode: 201, message: 'Technology created', data });
    } catch (e) { next(e); }
  }

  static async updateTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.updateTechnology(req.params.id, req.body);
      res.json({ statusCode: 200, message: 'Technology updated', data });
    } catch (e) { next(e); }
  }

  static async deleteTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteTechnology(req.params.id);
      res.json({ statusCode: 200, message: 'Technology deleted' });
    } catch (e) { next(e); }
  }

  // --- Topics CRUD ---
  
  static async getTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getTopics();
      res.json({ statusCode: 200, message: 'Success', data });
    } catch (e) { next(e); }
  }

  static async createTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.createTopic(req.body);
      res.status(201).json({ statusCode: 201, message: 'Topic created', data });
    } catch (e) { next(e); }
  }

  static async updateTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.updateTopic(req.params.id, req.body);
      res.json({ statusCode: 200, message: 'Topic updated', data });
    } catch (e) { next(e); }
  }

  static async deleteTopic(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteTopic(req.params.id);
      res.json({ statusCode: 200, message: 'Topic deleted' });
    } catch (e) { next(e); }
  }

  // --- Tests CRUD ---
  
  static async getTests(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getTests();
      res.json({ statusCode: 200, message: 'Success', data });
    } catch (e) { next(e); }
  }

  static async createTest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.createTest(req.body);
      res.status(201).json({ statusCode: 201, message: 'Test created', data });
    } catch (e) { next(e); }
  }

  static async updateTest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.updateTest(req.params.id, req.body);
      res.json({ statusCode: 200, message: 'Test updated', data });
    } catch (e) { next(e); }
  }

  static async deleteTest(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteTest(req.params.id);
      res.json({ statusCode: 200, message: 'Test deleted' });
    } catch (e) { next(e); }
  }

  // --- Questions CRUD ---
  
  static async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getQuestions();
      res.json({ statusCode: 200, message: 'Success', data });
    } catch (e) { next(e); }
  }

  static async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.createQuestion(req.body);
      res.status(201).json({ statusCode: 201, message: 'Question created', data });
    } catch (e) { next(e); }
  }

  static async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.updateQuestion(req.params.id, req.body);
      res.json({ statusCode: 200, message: 'Question updated', data });
    } catch (e) { next(e); }
  }

  static async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteQuestion(req.params.id);
      res.json({ statusCode: 200, message: 'Question deleted' });
    } catch (e) { next(e); }
  }

  // --- Users CRUD ---
  
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getUsers();
      res.json({ statusCode: 200, message: 'Success', data });
    } catch (e) { next(e); }
  }

  static async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.toggleUserStatus(req.params.id, req.body.isActive);
      res.json({ statusCode: 200, message: 'User status updated', data });
    } catch (e) { next(e); }
  }
}
