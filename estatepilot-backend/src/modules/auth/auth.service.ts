import jwt from 'jsonwebtoken';
import { AdminUser, IAdminUser } from './auth.model';
import { env } from '../../config/env';
import { AppError } from '../../middlewares/error.middleware';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;
    
    // Find admin user
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Update last login
    admin.lastLoginAt = new Date();
    await admin.save();
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRY }
    );
    
    return {
      token,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role
      }
    };
  }
  
  async register(
    email: string,
    password: string,
    role: 'super_admin' | 'admin' | 'viewer' = 'admin'
  ): Promise<IAdminUser> {
    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      throw new AppError('Admin already exists', 400);
    }
    
    // Create new admin
    const admin = new AdminUser({
      email,
      passwordHash: password,
      role
    });
    
    await admin.save();
    return admin;
  }
  
  async getProfile(adminId: string): Promise<IAdminUser | null> {
    return AdminUser.findById(adminId).select('-passwordHash');
  }
  
  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const admin = await AdminUser.findById(adminId);
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }
    
    // Verify current password
    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 400);
    }
    
    // Update password
    admin.passwordHash = newPassword;
    await admin.save();
  }
}
