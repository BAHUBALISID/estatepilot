import { Conversation, IConversation } from './conversations.model';
import { AppError } from '../../middlewares/error.middleware';

export interface AddMessageData {
  role: 'user' | 'assistant' | 'system';
  sender: 'user' | 'bot' | 'admin';
  text: string;
  metadata?: {
    intent?: string;
    projectId?: string;
    templateUsed?: string;
    isQualification?: boolean;
  };
}

export interface ConversationContext {
  projectId?: string;
  intent?: string;
  qualificationStep?: string;
}

export class ConversationsService {
  async getConversation(leadId: string): Promise<IConversation | null> {
    return Conversation.findOne({ leadId });
  }
  
  async getOrCreateConversation(leadId: string): Promise<IConversation> {
    let conversation = await Conversation.findOne({ leadId });
    
    if (!conversation) {
      conversation = new Conversation({
        leadId,
        messages: []
      });
      await conversation.save();
    }
    
    return conversation;
  }
  
  async addMessage(
    leadId: string,
    messageData: AddMessageData
  ): Promise<IConversation> {
    const conversation = await this.getOrCreateConversation(leadId);
    
    conversation.messages.push({
      ...messageData,
      timestamp: new Date()
    });
    
    // Keep only last 100 messages
    if (conversation.messages.length > 100) {
      conversation.messages = conversation.messages.slice(-100);
    }
    
    await conversation.save();
    return conversation;
  }
  
  async updateContext(
    leadId: string,
    context: ConversationContext
  ): Promise<IConversation | null> {
    return Conversation.findOneAndUpdate(
      { leadId },
      { 
        $set: { 
          lastContext: { ...context } 
        } 
      },
      { new: true }
    );
  }
  
  async getLastUserMessage(leadId: string): Promise<AddMessageData | null> {
    const conversation = await Conversation.findOne({ leadId });
    
    if (!conversation || conversation.messages.length === 0) {
      return null;
    }
    
    // Find last user message
    const userMessages = conversation.messages
      .filter(msg => msg.sender === 'user')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return userMessages.length > 0 ? userMessages[0] : null;
  }
  
  async getConversationHistory(
    leadId: string,
    limit: number = 50
  ): Promise<AddMessageData[]> {
    const conversation = await Conversation.findOne({ leadId });
    
    if (!conversation) {
      return [];
    }
    
    return conversation.messages
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
      .reverse();
  }
  
  async getQualificationProgress(leadId: string): Promise<{
    hasBudget: boolean;
    hasUnitType: boolean;
    hasTimeline: boolean;
    completedSteps: number;
    totalSteps: number;
  }> {
    const conversation = await Conversation.findOne({ leadId });
    
    if (!conversation) {
      return {
        hasBudget: false,
        hasUnitType: false,
        hasTimeline: false,
        completedSteps: 0,
        totalSteps: 3
      };
    }
    
    const qualificationMessages = conversation.messages.filter(
      msg => msg.metadata?.isQualification
    );
    
    const hasBudget = qualificationMessages.some(
      msg => msg.metadata?.intent === 'budget'
    );
    const hasUnitType = qualificationMessages.some(
      msg => msg.metadata?.intent === 'unit_type'
    );
    const hasTimeline = qualificationMessages.some(
      msg => msg.metadata?.intent === 'timeline'
    );
    
    const completedSteps = [hasBudget, hasUnitType, hasTimeline].filter(Boolean).length;
    
    return {
      hasBudget,
      hasUnitType,
      hasTimeline,
      completedSteps,
      totalSteps: 3
    };
  }
}
