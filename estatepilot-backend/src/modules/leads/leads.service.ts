import { Lead, ILead } from './leads.model';
import { LeadStatus, LeadIntent, FOLLOWUP_INTERVALS } from '../../constants/leadStatus';
import { AppError } from '../../middlewares/error.middleware';

export interface CreateLeadData {
  builderId: string;
  phone: string;
  name?: string;
  language: 'en' | 'hi' | 'hinglish';
  budget?: {
    min: number;
    max: number;
  };
  unitType?: string;
  timeline?: 'immediate' | 'short_term' | 'medium_term' | 'exploring';
  intent: LeadIntent;
}

export interface UpdateLeadData {
  name?: string;
  budget?: {
    min: number;
    max: number;
  };
  unitType?: string;
  timeline?: 'immediate' | 'short_term' | 'medium_term' | 'exploring';
  intent?: LeadIntent;
  status?: LeadStatus;
}

export interface LeadStats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  converted: number;
  lost: number;
  recent: number; // Leads from last 7 days
  trending: Array<{
    date: string;
    count: number;
  }>;
}

export class LeadsService {
  async createOrUpdateLead(data: CreateLeadData): Promise<ILead> {
    const { builderId, phone } = data;
    
    // Try to find existing lead
    let lead = await Lead.findOne({ builderId, phone });
    
    if (lead) {
      // Update existing lead
      lead.lastMessageAt = new Date();
      lead.language = data.language;
      
      // Update name if provided
      if (data.name && !lead.name) {
        lead.name = data.name;
      }
      
      // Update qualification data if not already set
      if (data.budget && !lead.budget) {
        lead.budget = data.budget;
      }
      
      if (data.unitType && !lead.unitType) {
        lead.unitType = data.unitType;
      }
      
      if (data.timeline && !lead.timeline) {
        lead.timeline = data.timeline;
      }
      
      if (data.intent) {
        lead.intent = data.intent;
      }
      
      await lead.save();
    } else {
      // Create new lead
      lead = new Lead({
        ...data,
        lastMessageAt: new Date()
      });
      await lead.save();
    }
    
    return lead;
  }
  
  async getLeadById(leadId: string): Promise<ILead | null> {
    return Lead.findById(leadId).populate('builderId', 'name businessName');
  }
  
  async getLeadByPhone(builderId: string, phone: string): Promise<ILead | null> {
    return Lead.findOne({ builderId, phone, isActive: true });
  }
  
  async getLeadsByBuilder(
    builderId: string,
    page: number = 1,
    limit: number = 20,
    status?: LeadStatus,
    search?: string
  ): Promise<{
    leads: ILead[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const filter: any = { builderId, isActive: true };
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { unitType: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('builderId', 'name businessName'),
      Lead.countDocuments(filter)
    ]);
    
    return {
      leads,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  async updateLead(
    leadId: string,
    data: UpdateLeadData
  ): Promise<ILead | null> {
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return lead;
  }
  
  async updateLeadStatus(
    leadId: string,
    status: LeadStatus
  ): Promise<ILead | null> {
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { 
        $set: { status },
        $unset: { nextFollowupAt: 1 } // Remove followup if status changed
      },
      { new: true }
    );
    
    return lead;
  }
  
  async getLeadStats(builderId: string): Promise<LeadStats> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const [
      total,
      hot,
      warm,
      cold,
      converted,
      lost,
      recent,
      dailyTrends
    ] = await Promise.all([
      Lead.countDocuments({ builderId, isActive: true }),
      Lead.countDocuments({ builderId, status: LeadStatus.HOT, isActive: true }),
      Lead.countDocuments({ builderId, status: LeadStatus.WARM, isActive: true }),
      Lead.countDocuments({ builderId, status: LeadStatus.COLD, isActive: true }),
      Lead.countDocuments({ builderId, status: LeadStatus.CONVERTED, isActive: true }),
      Lead.countDocuments({ builderId, status: LeadStatus.LOST, isActive: true }),
      Lead.countDocuments({ 
        builderId, 
        createdAt: { $gte: sevenDaysAgo },
        isActive: true 
      }),
      Lead.aggregate([
        {
          $match: {
            builderId,
            createdAt: { $gte: sevenDaysAgo },
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);
    
    const trending = dailyTrends.map(day => ({
      date: day._id,
      count: day.count
    }));
    
    return {
      total,
      hot,
      warm,
      cold,
      converted,
      lost,
      recent,
      trending
    };
  }
  
  async getLeadsForFollowup(): Promise<ILead[]> {
    const now = new Date();
    
    return Lead.find({
      isActive: true,
      status: { $in: [LeadStatus.HOT, LeadStatus.WARM, LeadStatus.COLD] },
      nextFollowupAt: { $lte: now },
      lastMessageAt: { 
        $lt: new Date(now.getTime() - 30 * 60 * 1000) // No message in last 30 mins
      }
    }).limit(100);
  }
  
  async scheduleNextFollowup(
    leadId: string,
    status: LeadStatus
  ): Promise<Date | null> {
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return null;
    }
    
    const now = new Date();
    let nextFollowupAt: Date;
    
    switch (status) {
      case LeadStatus.HOT:
        nextFollowupAt = new Date(now.getTime() + FOLLOWUP_INTERVALS.HOT);
        break;
      case LeadStatus.WARM:
        nextFollowupAt = new Date(now.getTime() + FOLLOWUP_INTERVALS.WARM);
        break;
      case LeadStatus.COLD:
        nextFollowupAt = new Date(now.getTime() + FOLLOWUP_INTERVALS.COLD);
        break;
      default:
        return null;
    }
    
    lead.nextFollowupAt = nextFollowupAt;
    lead.followupCount += 1;
    lead.lastFollowupAt = now;
    await lead.save();
    
    return nextFollowupAt;
  }
  
  async cancelFollowup(leadId: string): Promise<void> {
    await Lead.findByIdAndUpdate(leadId, {
      $unset: { nextFollowupAt: 1 }
    });
  }
}
