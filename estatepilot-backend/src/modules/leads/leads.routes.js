import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { z } from 'zod';
import {
  getLeads,
  getLead,
  updateLeadStatus,
  getLeadStats,
  scheduleFollowup
} from './leads.controller';

const router = Router();

// Validation schemas
const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['HOT', 'WARM', 'COLD', 'CONVERTED', 'LOST'])
  })
});

const scheduleFollowupSchema = z.object({
  body: z.object({
    status: z.enum(['HOT', 'WARM', 'COLD'])
  })
});

// Routes
router.get(
  '/builder/:builderId',
  authenticate,
  getLeads
);

router.get(
  '/:leadId',
  authenticate,
  getLead
);

router.patch(
  '/:leadId/status',
  authenticate,
  authorize('super_admin', 'admin'),
  validate(updateStatusSchema),
  updateLeadStatus
);

router.get(
  '/builder/:builderId/stats',
  authenticate,
  getLeadStats
);

router.post(
  '/:leadId/followup',
  authenticate,
  authorize('super_admin', 'admin'),
  validate(scheduleFollowupSchema),
  scheduleFollowup
);

export default router;
