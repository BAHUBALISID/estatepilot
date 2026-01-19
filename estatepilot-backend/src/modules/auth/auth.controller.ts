import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middlewares/auth.middleware';

const authService = new AuthService();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const result = await authService.login({ email, password });
  
  res.status(200).json({
    success: true,
    data: result
  });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  
  // Only allow registration if no admin exists (for initial setup)
  const adminCount = await authService['AdminUser'].countDocuments();
  if (adminCount > 0) {
    res.status(403).json({
      success: false,
      error: 'Registration disabled'
    });
    return;
  }
  
  const admin = await authService.register(email, password, role);
  
  res.status(201).json({
    success: true,
    data: {
      id: admin._id,
      email: admin.email,
      role: admin.role
    }
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const adminId = req.admin!.id;
  
  const admin = await authService.getProfile(adminId);
  
  res.status(200).json({
    success: true,
    data: admin
  });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const adminId = req.admin!.id;
  const { currentPassword, newPassword } = req.body;
  
  await authService.changePassword(adminId, currentPassword, newPassword);
  
  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});
