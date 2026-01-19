import { Project, IProject } from './projects.model';
import { AppError } from '../../middlewares/error.middleware';

export interface CreateProjectData {
  builderId: string;
  projectName: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    googleMapsLink?: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  unitConfigurations: Array<{
    type: string;
    carpetArea: number;
    superArea: number;
    priceRange: {
      min: number;
      max: number;
    };
  }>;
  amenities: string[];
  specifications: string[];
  reraNumber: string;
  possessionTimeline: string;
  paymentPlans: Array<{
    name: string;
    description: string;
    percentageOnBooking: number;
    constructionLinkedPercentage: number;
    possessionLinkedPercentage: number;
  }>;
  loanOptions: Array<{
    bankName: string;
    interestRate: number;
    maxLoanPercentage: number;
    tenureOptions: number[];
  }>;
  faqPoints: Array<{
    question: string;
    answer: string;
  }>;
  objectionHandlingPoints: Array<{
    objection: string;
    response: string;
  }>;
}

export class ProjectsService {
  async createProject(data: CreateProjectData): Promise<IProject> {
    const project = new Project(data);
    await project.save();
    return project;
  }
  
  async getProjectsByBuilder(
    builderId: string,
    page: number = 1,
    limit: number = 20,
    isActive?: boolean
  ): Promise<{
    projects: IProject[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const filter: any = { builderId };
    
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(filter)
    ]);
    
    return {
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  async getProjectById(projectId: string): Promise<IProject | null> {
    return Project.findById(projectId);
  }
  
  async updateProject(
    projectId: string,
    data: Partial<CreateProjectData>
  ): Promise<IProject | null> {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return project;
  }
  
  async deleteProject(projectId: string): Promise<void> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    
    // Soft delete - mark as inactive
    project.isActive = false;
    await project.save();
  }
  
  async getProjectForAI(projectId: string): Promise<any> {
    const project = await Project.findById(projectId).lean();
    if (!project) {
      return null;
    }
    
    // Format project data for AI grounding
    return {
      projectName: project.projectName,
      location: project.location,
      priceRange: project.priceRange,
      unitConfigurations: project.unitConfigurations,
      amenities: project.amenities,
      specifications: project.specifications,
      reraNumber: project.reraNumber,
      possessionTimeline: project.possessionTimeline,
      paymentPlans: project.paymentPlans,
      loanOptions: project.loanOptions,
      faqPoints: project.faqPoints,
      objectionHandlingPoints: project.objectionHandlingPoints
    };
  }
  
  async searchProjects(
    builderId: string,
    query: string,
    unitType?: string,
    minBudget?: number,
    maxBudget?: number
  ): Promise<IProject[]> {
    const filter: any = { builderId, isActive: true };
    
    if (query) {
      filter.$or = [
        { projectName: { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } },
        { 'location.address': { $regex: query, $options: 'i' } }
      ];
    }
    
    if (unitType) {
      filter['unitConfigurations.type'] = unitType;
    }
    
    if (minBudget !== undefined || maxBudget !== undefined) {
      filter.$or = [
        { 'priceRange.min': { $gte: minBudget || 0 } },
        { 'priceRange.max': { $lte: maxBudget || Number.MAX_SAFE_INTEGER } },
        {
          $and: [
            { 'priceRange.min': { $lte: maxBudget || Number.MAX_SAFE_INTEGER } },
            { 'priceRange.max': { $gte: minBudget || 0 } }
          ]
        }
      ];
    }
    
    return Project.find(filter).limit(10);
  }
}
