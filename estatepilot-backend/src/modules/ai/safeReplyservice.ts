import { GeminiService } from './gemini.service';
import { PromptBuilderService } from './promptBuilder.service';
import { GroundingService } from './grounding.service';
import { detectLanguage, translateTemplate } from '../../utils/languageDetect';
import { LeadIntent } from '../../constants/leadStatus';
import { IProject } from '../projects/projects.model';
import { logger } from '../../config/logger';

export class SafeReplyService {
  private geminiService: GeminiService;
  
  constructor() {
    this.geminiService = new GeminiService();
  }
  
  async generateGreeting(
    project: IProject,
    userMessage: string,
    language?: string,
    userName?: string
  ): Promise<string> {
    try {
      const detectedLanguage = language || detectLanguage(userMessage);
      const prompt = PromptBuilderService.buildGreetingPrompt(
        project,
        detectedLanguage,
        userName
      );
      
      const response = await this.geminiService.generateContent(prompt);
      return GroundingService.formatResponseForWhatsApp(response.text);
    } catch (error) {
      logger.error('Error generating greeting:', error);
      return translateTemplate('hi', detectedLanguage as any, {
        projectName: project.projectName
      });
    }
  }
  
  async generateQualificationQuestion(
    project: IProject,
    qualificationType: 'budget' | 'unitType' | 'timeline',
    language: string,
    previousAnswers?: Record<string, string>
  ): Promise<string> {
    try {
      const prompt = PromptBuilderService.buildQualificationPrompt(
        project,
        language,
        qualificationType,
        previousAnswers
      );
      
      const response = await this.geminiService.generateContent(prompt);
      return GroundingService.formatResponseForWhatsApp(response.text);
    } catch (error) {
      logger.error('Error generating qualification question:', error);
      
      // Fallback to template
      const templateKey = qualificationType === 'budget' ? 'budget' :
                         qualificationType === 'unitType' ? 'unitType' : 'timeline';
      
      return translateTemplate(templateKey, language as any);
    }
  }
  
  async generateResponse(
    project: IProject,
    userMessage: string,
    intent: LeadIntent,
    language: string,
    conversationHistory?: Array<{ role: string, text: string }>
  ): Promise<string> {
    try {
      // First check if this is a simple greeting
      const normalizedMessage = userMessage.toLowerCase().trim();
      if (['hi', 'hello', 'hey', 'नमस्ते', 'हैलो'].includes(normalizedMessage)) {
        return await this.generateGreeting(project, userMessage, language);
      }
      
      // Check if we need to escalate
      const needsEscalation = this.shouldEscalate(userMessage, intent);
      if (needsEscalation) {
        return translateTemplate('dataMissing', language as any);
      }
      
      // Generate AI response
      const prompt = PromptBuilderService.buildResponsePrompt(
        project,
        language,
        userMessage,
        intent,
        conversationHistory
      );
      
      const response = await this.geminiService.generateContent(prompt);
      const aiResponse = GroundingService.formatResponseForWhatsApp(response.text);
      
      // Validate response safety
      const isValid = this.validateResponse(aiResponse, project);
      if (!isValid) {
        logger.warn('AI response validation failed, escalating to human');
        return translateTemplate('dataMissing', language as any);
      }
      
      return aiResponse;
      
    } catch (error) {
      logger.error('Error generating AI response:', error);
      return translateTemplate('unknown', language as any);
    }
  }
  
  async generateFollowupMessage(
    project: IProject,
    language: string,
    leadInfo: {
      name?: string;
      unitType?: string;
      lastIntent?: LeadIntent;
    },
    followupType: 'hot' | 'warm' | 'cold'
  ): Promise<string> {
    try {
      const prompt = PromptBuilderService.buildFollowupPrompt(
        project,
        language,
        leadInfo,
        followupType
      );
      
      const response = await this.geminiService.generateContent(prompt);
      return GroundingService.formatResponseForWhatsApp(response.text);
    } catch (error) {
      logger.error('Error generating followup message:', error);
      
      // Fallback to template
      const templateKey = followupType;
      return translateTemplate(templateKey, language as any, {
        name: leadInfo.name || '',
        projectName: project.projectName,
        unitType: leadInfo.unitType || 'available units'
      });
    }
  }
  
  private shouldEscalate(userMessage: string, intent: LeadIntent): boolean {
    const escalationKeywords = [
      'meet', 'visit', 'call', 'contact', 'speak', 'talk', 'discuss',
      'मिलना', 'बात', 'कॉल', 'संपर्क', 'मिलो', 'बात करो',
      'negotiate', 'deal', 'discount', 'offer', 'bargain',
      'मोलभाव', 'छूट', 'ऑफर', 'डील'
    ];
    
    const message = userMessage.toLowerCase();
    
    // Escalate for contact requests
    if (escalationKeywords.some(keyword => message.includes(keyword))) {
      return true;
    }
    
    // Escalate for complex queries not covered by simple intents
    if (intent === LeadIntent.GENERAL && message.split(' ').length > 10) {
      return true;
    }
    
    return false;
  }
  
  private validateResponse(response: string, project: IProject): boolean {
    const projectData = project.toObject ? project.toObject() : project;
    
    // Check for hallucinated prices
    const pricePattern = /₹\s*[\d,]+/g;
    const mentionedPrices = response.match(pricePattern);
    
    if (mentionedPrices) {
      const projectPrices = [
        projectData.priceRange.min,
        projectData.priceRange.max,
        ...projectData.unitConfigurations.flatMap(unit => [
          unit.priceRange.min,
          unit.priceRange.max
        ])
      ].map(price => `₹${price.toLocaleString('en-IN')}`);
      
      for (const mentionedPrice of mentionedPrices) {
        if (!projectPrices.some(projectPrice => 
          projectPrice.includes(mentionedPrice.replace(/[^0-9]/g, ''))
        )) {
          logger.warn(`Hallucinated price detected: ${mentionedPrice}`);
          return false;
        }
      }
    }
    
    // Check for hallucinated amenities
    const amenities = projectData.amenities.map(a => a.toLowerCase());
    const words = response.toLowerCase().split(/\W+/);
    
    const commonAmenities = ['gym', 'pool', 'park', 'garden', 'club', 'security', 'lift'];
    for (const amenity of commonAmenities) {
      if (words.includes(amenity) && !amenities.some(a => a.includes(amenity))) {
        logger.warn(`Hallucinated amenity detected: ${amenity}`);
        return false;
      }
    }
    
    // Check for safety violations
    const unsafePatterns = [
      /special offer/i,
      /limited time/i,
      /discount/i,
      /deal/i,
      /exclusive/i,
      /promise/i,
      /guarantee/i,
      /assure/i,
      /definitely/i,
      /certainly/i
    ];
    
    for (const pattern of unsafePatterns) {
      if (pattern.test(response) && !this.isInProjectData(response, projectData)) {
        logger.warn(`Unsafe pattern detected: ${pattern}`);
        return false;
      }
    }
    
    return true;
  }
  
  private isInProjectData(response: string, projectData: any): boolean {
    const projectText = JSON.stringify(projectData).toLowerCase();
    const responseWords = response.toLowerCase().split(/\W+/);
    
    for (const word of responseWords) {
      if (word.length > 5 && !projectText.includes(word)) {
        return false;
      }
    }
    
    return true;
  }
}
