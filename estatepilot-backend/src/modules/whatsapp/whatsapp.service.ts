import axios from 'axios';
import { WHATSAPP_API_BASE_URL, whatsappConfig } from '../../config/whatsapp';
import { Builder } from '../builders/builders.model';
import { LeadsService } from '../leads/leads.service';
import { ConversationsService } from '../conversations/conversations.service';
import { ProjectsService } from '../projects/projects.service';
import { SafeReplyService } from '../ai/safeReply.service';
import { detectLanguage } from '../../utils/languageDetect';
import { extractKeywords, detectIntentFromText } from '../../utils/normalizeText';
import { LeadIntent, LeadStatus } from '../../constants/leadStatus';
import { logger } from '../../config/logger';
import { AppError } from '../../middlewares/error.middleware';

export interface WhatsAppMessage {
  from: string; // phone number
  id: string;
  timestamp: string;
  type: string;
  text?: {
    body: string;
  };
  interactive?: {
    type: string;
    button_reply?: {
      id: string;
      title: string;
    };
    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
  };
}

export class WhatsAppService {
  private leadsService: LeadsService;
  private conversationsService: ConversationsService;
  private projectsService: ProjectsService;
  private safeReplyService: SafeReplyService;
  private accessToken: string;
  private phoneNumberId: string;
  
  constructor() {
    this.leadsService = new LeadsService();
    this.conversationsService = new ConversationsService();
    this.projectsService = new ProjectsService();
    this.safeReplyService = new SafeReplyService();
    this.accessToken = whatsappConfig.accessToken;
    this.phoneNumberId = whatsappConfig.phoneNumberId;
  }
  
  async processIncomingMessage(
    message: WhatsAppMessage,
    phoneNumberId?: string
  ): Promise<void> {
    try {
      const phone = message.from.replace('whatsapp:', '');
      const text = this.extractMessageText(message);
      
      if (!text) {
        logger.warn('No text content in message');
        return;
      }
      
      logger.info(`Processing message from ${phone}: ${text.substring(0, 50)}...`);
      
      // Find builder by WhatsApp number
      const builder = await Builder.findOne({ phone: phoneNumberId });
      if (!builder) {
        logger.error(`No builder found for WhatsApp number: ${phoneNumberId}`);
        return;
      }
      
      // Detect language
      const language = detectLanguage(text);
      
      // Get or create lead
      const lead = await this.leadsService.createOrUpdateLead({
        builderId: builder._id.toString(),
        phone,
        language,
        intent: this.mapIntent(detectIntentFromText(text))
      });
      
      // Store incoming message
      await this.conversationsService.addMessage(lead._id.toString(), {
        role: 'user',
        sender: 'user',
        text,
        metadata: {
          intent: detectIntentFromText(text)
        }
      });
      
      // Cancel any pending followups since user replied
      await this.leadsService.cancelFollowup(lead._id.toString());
      
      // Get conversation history
      const conversation = await this.conversationsService.getConversation(
        lead._id.toString()
      );
      
      // Get project (for now, use first active project)
      const projects = await this.projectsService.getProjectsByBuilder(
        builder._id.toString(),
        1,
        1,
        true
      );
      
      if (projects.projects.length === 0) {
        await this.sendMessage(phone, "No active projects found. Please contact support.");
        return;
      }
      
      const project = projects.projects[0];
      
      // Check qualification progress
      const qualification = await this.conversationsService.getQualificationProgress(
        lead._id.toString()
      );
      
      let response: string;
      
      // If first message or greeting, send greeting
      if (!conversation || conversation.messages.length <= 1) {
        response = await this.safeReplyService.generateGreeting(
          project,
          text,
          language,
          lead.name
        );
        
        // Ask first qualification question
        const qualificationQuestion = await this.safeReplyService.generateQualificationQuestion(
          project,
          'budget',
          language
        );
        
        await this.sendMessage(phone, response);
        await this.sendMessage(phone, qualificationQuestion);
        
        await this.conversationsService.addMessage(lead._id.toString(), {
          role: 'assistant',
          sender: 'bot',
          text: qualificationQuestion,
          metadata: {
            isQualification: true,
            intent: 'budget'
          }
        });
        
        return;
      }
      
      // Check if this is a qualification answer
      const lastMessage = conversation.messages[conversation.messages.length - 2];
      if (lastMessage?.metadata?.isQualification) {
        await this.handleQualificationResponse(
          lead,
          project,
          text,
          language,
          lastMessage.metadata.intent
        );
        return;
      }
      
      // Generate AI response
      const conversationHistory = conversation.messages.slice(-5).map(msg => ({
        role: msg.role,
        text: msg.text
      }));
      
      response = await this.safeReplyService.generateResponse(
        project,
        text,
        this.mapIntent(detectIntentFromText(text)),
        language,
        conversationHistory
      );
      
      // Send response
      await this.sendMessage(phone, response);
      
      // Store response
      await this.conversationsService.addMessage(lead._id.toString(), {
        role: 'assistant',
        sender: 'bot',
        text: response,
        metadata: {
          intent: detectIntentFromText(text),
          projectId: project._id.toString()
        }
      });
      
      // Update lead's last message time
      lead.lastMessageAt = new Date();
      await lead.save();
      
    } catch (error) {
      logger.error('Error processing WhatsApp message:', error);
      
      // Send error message to user
      try {
        await this.sendMessage(
          message.from.replace('whatsapp:', ''),
          "Sorry, I'm having trouble processing your request. Our team will contact you shortly."
        );
      } catch (sendError) {
        logger.error('Error sending error message:', sendError);
      }
    }
  }
  
  private async handleQualificationResponse(
    lead: any,
    project: any,
    userResponse: string,
    language: string,
    qualificationType: string
  ): Promise<void> {
    // Update lead based on qualification response
    let updateData: any = {};
    
    switch (qualificationType) {
      case 'budget':
        const budget = this.parseBudgetResponse(userResponse);
        if (budget) {
          updateData.budget = budget;
        }
        break;
      case 'unitType':
        const unitType = this.parseUnitTypeResponse(userResponse);
        if (unitType) {
          updateData.unitType = unitType;
        }
        break;
      case 'timeline':
        const timeline = this.parseTimelineResponse(userResponse);
        if (timeline) {
          updateData.timeline = timeline;
        }
        break;
    }
    
    if (Object.keys(updateData).length > 0) {
      await this.leadsService.updateLead(lead._id.toString(), updateData);
    }
    
    // Store qualification response
    await this.conversationsService.addMessage(lead._id.toString(), {
      role: 'user',
      sender: 'user',
      text: userResponse,
      metadata: {
        isQualification: true,
        intent: qualificationType
      }
    });
    
    // Check what to ask next
    const qualification = await this.conversationsService.getQualificationProgress(
      lead._id.toString()
    );
    
    let nextQuestionType: 'budget' | 'unitType' | 'timeline' | null = null;
    
    if (!qualification.hasBudget) {
      nextQuestionType = 'budget';
    } else if (!qualification.hasUnitType) {
      nextQuestionType = 'unitType';
    } else if (!qualification.hasTimeline) {
      nextQuestionType = 'timeline';
    }
    
    if (nextQuestionType) {
      const question = await this.safeReplyService.generateQualificationQuestion(
        project,
        nextQuestionType,
        language,
        { [qualificationType]: userResponse }
      );
      
      await this.sendMessage(lead.phone, question);
      
      await this.conversationsService.addMessage(lead._id.toString(), {
        role: 'assistant',
        sender: 'bot',
        text: question,
        metadata: {
          isQualification: true,
          intent: nextQuestionType
        }
      });
    } else {
      // All qualifications done, ask how we can help
      const completionMessage = `Thanks for sharing that information! How can I help you with ${project.projectName} today?`;
      
      await this.sendMessage(lead.phone, completionMessage);
      
      await this.conversationsService.addMessage(lead._id.toString(), {
        role: 'assistant',
        sender: 'bot',
        text: completionMessage
      });
    }
  }
  
  async sendMessage(to: string, text: string): Promise<void> {
    try {
      const url = `${WHATSAPP_API_BASE_URL}/${this.phoneNumberId}/messages`;
      
      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to.replace('whatsapp:', ''),
          type: 'text',
          text: {
            body: text
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info(`Message sent to ${to}: ${response.data.messages?.[0]?.id}`);
    } catch (error: any) {
      logger.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw new AppError('Failed to send WhatsApp message', 500);
    }
  }
  
  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = 'en',
    components?: any[]
  ): Promise<void> {
    try {
      const url = `${WHATSAPP_API_BASE_URL}/${this.phoneNumberId}/messages`;
      
      const payload: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to.replace('whatsapp:', ''),
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          }
        }
      };
      
      if (components) {
        payload.template.components = components;
      }
      
      await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      logger.info(`Template message sent to ${to}: ${templateName}`);
    } catch (error: any) {
      logger.error('Error sending template message:', error.response?.data || error.message);
      throw new AppError('Failed to send template message', 500);
    }
  }
  
  private extractMessageText(message: WhatsAppMessage): string {
    if (message.type === 'text') {
      return message.text?.body || '';
    } else if (message.type === 'interactive') {
      if (message.interactive?.button_reply) {
        return message.interactive.button_reply.title;
      } else if (message.interactive?.list_reply) {
        return message.interactive.list_reply.title;
      }
    }
    
    return '';
  }
  
  private mapIntent(detectedIntent: string): LeadIntent {
    const intentMap: Record<string, LeadIntent> = {
      'PRICING': LeadIntent.PRICING,
      'PRICE': LeadIntent.PRICING,
      'LOCATION': LeadIntent.LOCATION,
      'AMENITIES': LeadIntent.AMENITIES,
      'RERA': LeadIntent.RERA,
      'POSSESSION': LeadIntent.POSSESSION,
      'PAYMENT_PLAN': LeadIntent.PAYMENT_PLAN,
      'LOAN': LeadIntent.LOAN,
      'SITE_VISIT': LeadIntent.SITE_VISIT,
      'CONTACT': LeadIntent.CONTACT
    };
    
    return intentMap[detectedIntent] || LeadIntent.GENERAL;
  }
  
  private parseBudgetResponse(response: string): { min: number; max: number } | null {
    const matches = response.match(/\d+/g);
    if (!matches) return null;
    
    const numbers = matches.map(Number);
    if (numbers.length >= 2) {
      return {
        min: Math.min(...numbers.slice(0, 2)),
        max: Math.max(...numbers.slice(0, 2))
      };
    }
    
    return null;
  }
  
  private parseUnitTypeResponse(response: string): string | null {
    const unitTypes = ['1bhk', '2bhk', '3bhk', '4bhk', 'penthouse', 'villa'];
    const normalized = response.toLowerCase();
    
    for (const unitType of unitTypes) {
      if (normalized.includes(unitType)) {
        return unitType.toUpperCase();
      }
    }
    
    return null;
  }
  
  private parseTimelineResponse(response: string): string | null {
    const normalized = response.toLowerCase();
    
    if (normalized.includes('immediate') || normalized.includes('now') || normalized.includes('urgent')) {
      return 'immediate';
    } else if (normalized.includes('short') || normalized.includes('1-3') || normalized.includes('soon')) {
      return 'short_term';
    } else if (normalized.includes('medium') || normalized.includes('3-6') || normalized.includes('few months')) {
      return 'medium_term';
    } else if (normalized.includes('exploring') || normalized.includes('just looking') || normalized.includes('research')) {
      return 'exploring';
    }
    
    return null;
  }
}
