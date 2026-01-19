import { Request, Response } from 'express';
import { BuildersService } from './builders.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middlewares/auth.middleware';

const buildersService = new BuildersService();

export const createBuilder = asyncHandler(async (req: Request, res: Response) => {
  const builder = await buildersService.createBuilder(req.body);
  
  res.status(201).json({
    success: true,
    data: builder
  });
});

export const getBuilders = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;
  const isActive = req.query.isActive !== undefined 
    ? req.query.isActive === 'true'
    : undefined;
  
  const result = await buildersService.getBuilders(page, limit, search, isActive);
  
  res.status(200).json({
    success: true,
    data: result
  });
});

export const getBuilder = asyncHandler(async (req: Request, res: Response) => {
  const { builderId } = req.params;
  
  const builder = await buildersService.getBuilderById(builderId);
  
  if (!builder) {
    res.status(404).json({
      success: false,
      error: 'Builder not found'
    });
    return;
  }
  
  res.status(200).json({
    success: true,
    data: builder
  });
});

export const updateBuilder = asyncHandler(async (req: Request, res: Response) => {
  const { builderId } = req.params;
  
  const builder = await buildersService.updateBuilder(builderId, req.body);
  
  if (!builder) {
    res.status(404).json({
      success: false,
      error: 'Builder not found'
    });
    return;
  }
  
  res.status(200).json({
    success: true,
    data: builder
  });
});

export const deleteBuilder = asyncHandler(async (req: Request, res: Response) => {
  const { builderId } = req.params;
  
  await buildersService.deleteBuilder(builderId);
  
  res.status(200).json({
    success: true,
    message: 'Builder deleted successfully'
  });
});

export const getBuilderStats = asyncHandler(async (req: Request, res: Response) => {
  const { builderId } = req.params;
  
  const stats = await buildersService.getBuilderStats(builderId);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});
