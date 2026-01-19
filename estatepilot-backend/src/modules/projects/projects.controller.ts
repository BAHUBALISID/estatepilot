import { Request, Response } from 'express';
import { ProjectsService } from './projects.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middlewares/auth.middleware';

const projectsService = new ProjectsService();

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectsService.createProject(req.body);
  
  res.status(201).json({
    success: true,
    data: project
  });
});

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const { builderId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const isActive = req.query.isActive !== undefined 
    ? req.query.isActive === 'true'
    : undefined;
  
  const result = await projectsService.getProjectsByBuilder(
    builderId,
    page,
    limit,
    isActive
  );
  
  res.status(200).json({
    success: true,
    data: result
  });
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  
  const project = await projectsService.getProjectById(projectId);
  
  if (!project) {
    res.status(404).json({
      success: false,
      error: 'Project not found'
    });
    return;
  }
  
  res.status(200).json({
    success: true,
    data: project
  });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  
  const project = await projectsService.updateProject(projectId, req.body);
  
  if (!project) {
    res.status(404).json({
      success: false,
      error: 'Project not found'
    });
    return;
  }
  
  res.status(200).json({
    success: true,
    data: project
  });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  
  await projectsService.deleteProject(projectId);
  
  res.status(200).json({
    success: true,
    message: 'Project deleted successfully'
  });
});

export const searchProjects = asyncHandler(async (req: Request, res: Response) => {
  const { builderId } = req.params;
  const { query, unitType, minBudget, maxBudget } = req.query;
  
  const projects = await projectsService.searchProjects(
    builderId,
    query as string,
    unitType as string,
    minBudget ? parseInt(minBudget as string) : undefined,
    maxBudget ? parseInt(maxBudget as string) : undefined
  );
  
  res.status(200).json({
    success: true,
    data: projects
  });
});
