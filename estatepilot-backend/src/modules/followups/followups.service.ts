import { Followup, IFollowup } from './followups.model';
import { LeadStatus, FOLLOWUP_INTERVALS } from '../../constants/leadStatus';
import { AppError } from '../../middlewares/error.middleware';
import { LeadsService } from '../leads/leads.service';
import { ConversationsService } from '../conversations/conversations.service';

export class FollowupsService {
  private leadsService: LeadsService;
  private conversationsService: ConversationsService;
  
  constructor() {
    this.leadsService = new LeadsService();
    this.conversationsService = new ConversationsService();
  }
  
  async createFollowup(
    leadId: string,
    status: LeadStatus,
    nextFollowupAt: Date
  ): Promise<IFollowup> {
    // Check if active followup already exists
    const existingFollowup = await Followup.findOne({
      leadId,
      active: true
    });
    
    if (existingFollowup) {
      throw new AppError('Active followup already exists for this lead', 400);
    }
    
    const followup = new Followup({
      leadId,
      status,
      nextFollowupAt,
      active: true
    });
    
    await followup.save();
    return followup;
  }
  
  async getPendingFollowups(): Promise<IFollowup[]> {
    const now = new Date();
    
    return Followup.find({
      active: true,
      nextFollowupAt: { $lte: now }
    })
    .populate('leadId')
    .limit(100);
  }
  
  async processFollowup(followupId: string): Promise<boolean> {
    const followup = await Followup.findById(followupId).populate('leadId');
    
    if (!followup || !followup.active) {
      return false;
    }
    
    const lead = followup.leadId as any;
    if (!lead || !lead.isActive) {
      // Deactivate followup if lead is inactive
      followup.active = false;
      await followup.save();
      return false;
    }
    
    // Get conversation history to check if user has replied recently
    const lastUserMessage = await this.conversationsService.getLastUserMessage(
      lead._id.toString()
    );
    
    if (lastUserMessage) {
      const timeSinceLastMessage = Date.now() - lastUserMessage.timestamp.getTime();
      
      // If user replied within last 30 minutes, don't send followup
      if (timeSinceLastMessage < 30 * 60 * 1000) {
        followup.active = false;
        await followup.save();
        return false;
      }
    }
    
    // Send followup message (this would integrate with WhatsApp service)
    // For now, just update the followup record
    
    followup.attemptCount += 1;
    followup.lastSentAt = new Date();
    
    // Schedule next followup based on status
    const nextInterval = FOLLOWUP_INTERVALS[followup.status];
    followup.nextFollowupAt = new Date(Date.now() + nextInterval);
    
    // Max 3 attempts for each status
    if (followup.attemptCount >= 3) {
      followup.active = false;
    }
    
    await followup.save();
    
    // Update lead's followup info
    await this.leadsService.scheduleNextFollowup(
      lead._id.toString(),
      followup.status
    );
    
    return true;
  }
  
  async cancelFollowup(leadId: string): Promise<void> {
    await Followup.updateMany(
      { leadId, active: true },
      { $set: { active: false } }
    );
  }
  
  async getFollowupStats(builderId: string): Promise<{
    total: number;
    pending: number;
    sentToday: number;
    byStatus: Record<string, number>;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [total, pending, sentToday, byStatus] = await Promise.all([
      Followup.countDocuments({ active: true }),
      Followup.countDocuments({
        active: true,
        nextFollowupAt: { $lte: new Date() }
      }),
      Followup.countDocuments({
        lastSentAt: { $gte: today }
      }),
      Followup.aggregate([
        { $match: { active: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);
    
    const statusMap = byStatus.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      pending,
      sentToday,
      byStatus: statusMap
    };
  }
}
