import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.register(req.body);
      res.status(201).json({ statusCode: 201, message: 'User registered successfully', data });
    } catch (e) { next(e); }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.login(req.body);
      res.json({ statusCode: 200, message: 'Login successful', data });
    } catch (e) { next(e); }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.user!.sub);
      res.json({ statusCode: 200, message: 'Logout successful' });
    } catch (e) { next(e); }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.refresh(req.body.refreshToken);
      res.json({ statusCode: 200, message: 'Token refreshed successfully', data });
    } catch (e) { next(e); }
  }
}
