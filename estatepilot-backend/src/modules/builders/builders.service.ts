import { Builder, IBuilder } from './builders.model';
import { AppError } from '../../middlewares/error.middleware';

export interface CreateBuilderData {
  name: string;
  phone: string;
  businessName: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
}

export interface UpdateBuilderData {
  name?: string;
  phone?: string;
  businessName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  isActive?: boolean;
}

export class BuildersService {
  async createBuilder(data: CreateBuilderData): Promise<IBuilder> {
    // Check if phone already exists
    const existingBuilder = await Builder.findOne({ phone: data.phone });
    if (existingBuilder) {
      throw new AppError('Builder with this phone already exists', 400);
    }
    
    const builder = new Builder(data);
    await builder.save();
    return builder;
  }
  
  async getBuilders(
    page: number = 1,
    limit: number = 20,
    search?: string,
    isActive?: boolean
  ): Promise<{
    builders: IBuilder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    
    const [builders, total] = await Promise.all([
      Builder.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Builder.countDocuments(filter)
    ]);
    
    return {
      builders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  async getBuilderById(builderId: string): Promise<IBuilder | null> {
    return Builder.findById(builderId);
  }
  
  async getBuilderByPhone(phone: string): Promise<IBuilder | null> {
    return Builder.findOne({ phone, isActive: true });
  }
  
  async updateBuilder(
    builderId: string,
    data: UpdateBuilderData
  ): Promise<IBuilder | null> {
    if (data.phone) {
      const existingBuilder = await Builder.findOne({
        phone: data.phone,
        _id: { $ne: builderId }
      });
      
      if (existingBuilder) {
        throw new AppError('Another builder with this phone already exists', 400);
      }
    }
    
    const builder = await Builder.findByIdAndUpdate(
      builderId,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return builder;
  }
  
  async deleteBuilder(builderId: string): Promise<void> {
    const builder = await Builder.findById(builderId);
    if (!builder) {
      throw new AppError('Builder not found', 404);
    }
    
    // Soft delete - mark as inactive
    builder.isActive = false;
    await builder.save();
  }
  
  async getBuilderStats(builderId: string) {
    const builder = await Builder.findById(builderId);
    if (!builder) {
      throw new AppError('Builder not found', 404);
    }
    
    // Get projects count
    const { Project } = require('../projects/projects.model');
    const projectsCount = await Project.countDocuments({ builderId });
    
    // Get leads count by status
    const { Lead } = require('../leads/leads.model');
    const leadsStats = await Lead.aggregate([
      { $match: { builderId: builderId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    return {
      builder,
      projectsCount,
      leadsStats: leadsStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
