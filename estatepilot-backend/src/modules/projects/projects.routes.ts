import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { z } from 'zod';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  searchProjects
} from './projects.controller';

const router = Router();

// Validation schemas
const createProjectSchema = z.object({
  body: z.object({
    builderId: z.string(),
    projectName: z.string().min(2).max(200),
    location: z.object({
      address: z.string().min(5).max(500),
      city: z.string().min(2).max(100),
      state: z.string().min(2).max(100),
      pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
      googleMapsLink: z.string().url().optional()
    }),
    priceRange: z.object({
      min: z.number().min(0),
      max: z.number().min(0)
    }),
    unitConfigurations: z.array(z.object({
      type: z.string(),
      carpetArea: z.number().min(0),
      superArea: z.number().min(0),
      priceRange: z.object({
        min: z.number().min(0),
        max: z.number().min(0)
      })
    })),
    amenities: z.array(z.string()),
    specifications: z.array(z.string()),
    reraNumber: z.string(),
    possessionTimeline: z.string(),
    paymentPlans: z.array(z.object({
      name: z.string(),
      description: z.string(),
      percentageOnBooking: z.number().min(0).max(100),
      constructionLinkedPercentage: z.number().min(0).max(100),
      possessionLinkedPercentage: z.number().min(0).max(100)
    })),
    loanOptions: z.array(z.object({
      bankName: z.string(),
      interestRate: z.number().min(0),
      maxLoanPercentage: z.number().min(0).max(100),
      tenureOptions: z.array(z.number().min(0))
    })),
    faqPoints: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })),
    objectionHandlingPoints: z.array(z.object({
      objection: z.string(),
      response: z.string()
    }))
  })
});

// Routes
router.post(
  '/',
  authenticate,
  authorize('super_admin', 'admin'),
  validate(createProjectSchema),
  createProject
);

router.get(
  '/builder/:builderId',
  authenticate,
  getProjects
);

router.get(
  '/:projectId',
  authenticate,
  getProject
);

router.patch(
  '/:projectId',
  authenticate,
  authorize('super_admin', 'admin'),
  updateProject
);

router.delete(
  '/:projectId',
  authenticate,
  authorize('super_admin'),
  deleteProject
);

router.get(
  '/builder/:builderId/search',
  authenticate,
  searchProjects
);

export default router;
