import { Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class UsersController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await UsersService.getProfile(req.user!.sub);
      res.json({ statusCode: 200, message: 'Profile retrieved successfully', data });
    } catch (e) { next(e); }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await UsersService.updateProfile(req.user!.sub, req.body);
      res.json({ statusCode: 200, message: 'Profile updated successfully', data });
    } catch (e) { next(e); }
  }
}
