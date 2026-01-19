import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { z } from 'zod';
import {
  login,
  register,
  getProfile,
  changePassword
} from './auth.controller';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['super_admin', 'admin', 'viewer']).optional()
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8)
  })
});

// Routes
router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.get('/profile', authenticate, getProfile);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
