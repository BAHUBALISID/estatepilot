import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { z } from 'zod';
import {
  createBuilder,
  getBuilders,
  getBuilder,
  updateBuilder,
  deleteBuilder,
  getBuilderStats
} from './builders.controller';

const router = Router();

// Validation schemas
const createBuilderSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
    businessName: z.string().min(2).max(200),
    email: z.string().email().optional(),
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode').optional(),
    gstNumber: z.string().max(15).optional()
  })
});

const updateBuilderSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional(),
    businessName: z.string().min(2).max(200).optional(),
    email: z.string().email().optional(),
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode').optional(),
    gstNumber: z.string().max(15).optional(),
    isActive: z.boolean().optional()
  })
});

// Routes
router.post(
  '/',
  authenticate,
  authorize('super_admin', 'admin'),
  validate(createBuilderSchema),
  createBuilder
);

router.get(
  '/',
  authenticate,
  getBuilders
);

router.get(
  '/:builderId',
  authenticate,
  getBuilder
);

router.patch(
  '/:builderId',
  authenticate,
  authorize('super_admin', 'admin'),
  validate(updateBuilderSchema),
  updateBuilder
);

router.delete(
  '/:builderId',
  authenticate,
  authorize('super_admin'),
  deleteBuilder
);

router.get(
  '/:builderId/stats',
  authenticate,
  getBuilderStats
);

export default router;
