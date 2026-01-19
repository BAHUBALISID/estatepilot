import { Request, Response } from 'express';
import { LeadsService } from './leads.service';
import { LeadStatus } from '../../constants/leadStatus';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middlewares/auth.middleware';

const leadsService = new LeadsService();

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const { builderId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as LeadStatus;
  const search = req.query.search as string;
  
  const result = await leadsService.getLeadsByBuilder(
    builderId,
    page,
    limit,
    status,
    search
  );
  
  res.status(200).json({
    success: true,
    data: result
  });
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const { leadId } = req.params;
  
  const lead = await leadsService.getLeadById(leadId);
  
  if (!lead) {
    res.status(404).json({
      success: false,
      error: 'Lead not found'
    });
    return;
  }
  
  res.status(200).json({
    success: true,
    data: lead
  });
});

export const updateLeadStatus = asyncHandler(async (req: Request, res: Response) => {
  const { leadId } = req.params;
  const { status } = req.body;
  
  if (!Object.values(LeadStatus).includes(status)) {
    res.status(400).json({
      success: false,
      error: 'Invalid status'
    });
    return;
  }
  
  const lead = await leadsService.updateLeadStatus(leadId, status);
  
  if (!lead) {
    res.status(404).json({
      success: false,
      error: 'Lead not found'
    });
    return;
  }
  
  res.status(200).json({
    success: true,
    data: lead
  });
});

export const getLeadStats = asyncHandler(async (req: Request, res: Response) => {
  const { builderId } = req.params;
  
  const stats = await leadsService.getLeadStats(builderId);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

export const scheduleFollowup = asyncHandler(async (req: Request, res: Response) => {
  const { leadId } = req.params;
  const { status } = req.body;
  
  if (!Object.values(LeadStatus).includes(status)) {
    res.status(400).json({
      success: false,
      error: 'Invalid status'
    });
    return;
  }
  
  const nextFollowupAt = await leadsService.scheduleNextFollowup(leadId, status);
  
  if (!nextFollowupAt) {
    res.status(404).json({
      success: false,
      error: 'Lead not found'
    });
    return;
  }
  
  res.status(200).json({
    success: true,
    data: {
      nextFollowupAt,
      message: 'Followup scheduled successfully'
    }
  });
});
