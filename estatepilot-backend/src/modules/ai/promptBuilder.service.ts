import { detectLanguage } from '../../utils/languageDetect';
import { GroundingService } from './grounding.service';
import { IProject } from '../projects/projects.model';
import { LeadIntent } from '../../constants/leadStatus';

export class PromptBuilderService {
  static buildGreetingPrompt(
    project: IProject,
    language: string,
    userName?: string
  ): string {
    const greeting = userName 
      ? `Hello ${userName}! Welcome to ${project.projectName}.`
      : `Hello! Welcome to ${project.projectName}.`;
    
    const context = GroundingService.groundProjectData(project, language as any);
    const constraints = GroundingService.getConstraints();
    
    return `
${context}

${constraints.join('\n')}

USER MESSAGE: "${greeting}"

RESPONSE GUIDELINES:
1. Greet the user warmly
2. Introduce yourself as the AI assistant for ${project.projectName}
3. Ask how you can help them today
4. Keep it under 2 sentences

YOUR RESPONSE:
    `.trim();
  }
  
  static buildQualificationPrompt(
    project: IProject,
    language: string,
    qualificationType: 'budget' | 'unitType' | 'timeline',
    previousAnswers?: Record<string, string>
  ): string {
    const context = GroundingService.groundProjectData(project, language as any);
    const constraints = GroundingService.getConstraints();
    
    let qualificationQuestion = '';
    let guidance = '';
    
    switch (qualificationType) {
      case 'budget':
        qualificationQuestion = 'What is your budget range?';
        guidance = 'Ask about their budget range in a polite way. Mention our price ranges if relevant.';
        break;
      case 'unitType':
        qualificationQuestion = 'What type of unit are you interested in?';
        guidance = 'Ask about their preferred unit type. Mention available unit configurations.';
        break;
      case 'timeline':
        qualificationQuestion = 'What is your timeline for purchase?';
        guidance = 'Ask about their purchase timeline politely.';
        break;
    }
    
    return `
${context}

${constraints.join('\n')}

CONVERSATION CONTEXT:
${previousAnswers ? Object.entries(previousAnswers).map(([key, value]) => 
  `${key}: ${value}`
).join('\n') : 'First qualification question.'}

YOUR TASK: Ask the next qualification question about ${qualificationType}.

GUIDANCE: ${guidance}
Do NOT answer their question yet. Just ask the qualification question.

YOUR RESPONSE (just the question, be polite and concise):
    `.trim();
  }
  
  static buildResponsePrompt(
    project: IProject,
    language: string,
    userMessage: string,
    intent: LeadIntent,
    conversationHistory?: Array<{ role: string, text: string }>
  ): string {
    const context = GroundingService.groundProjectData(project, language as any);
    const constraints = GroundingService.getConstraints();
    
    let intentGuidance = '';
    
    switch (intent) {
      case LeadIntent.PRICING:
        intentGuidance = 'Provide accurate pricing information from project data. Do not speculate.';
        break;
      case LeadIntent.LOCATION:
        intentGuidance = 'Provide location details exactly as in project data.';
        break;
      case LeadIntent.AMENITIES:
        intentGuidance = 'List amenities exactly as in project data. Do not add any.';
        break;
      case LeadIntent.RERA:
        intentGuidance = 'Provide RERA number exactly as in project data.';
        break;
      case LeadIntent.POSSESSION:
        intentGuidance = 'Provide possession timeline exactly as in project data.';
        break;
      case LeadIntent.PAYMENT_PLAN:
        intentGuidance = 'Explain payment plans exactly as in project data.';
        break;
      case LeadIntent.LOAN:
        intentGuidance = 'Explain loan options exactly as in project data.';
        break;
      default:
        intentGuidance = 'Provide helpful, factual information based on project data.';
    }
    
    const historyText = conversationHistory 
      ? `Recent Conversation:\n${conversationHistory.slice(-3).map(msg => 
          `${msg.role}: ${msg.text}`
        ).join('\n')}`
      : 'No recent conversation history.';
    
    return `
${context}

${constraints.join('\n')}

CONVERSATION HISTORY:
${historyText}

DETECTED INTENT: ${intent}
GUIDANCE: ${intentGuidance}

USER MESSAGE: "${userMessage}"

YOUR TASK: Respond to the user's query based ONLY on the project data above.
If information is not available in project data, say you'll connect them with the team.
Keep response concise and helpful.

YOUR RESPONSE:
    `.trim();
  }
  
  static buildFollowupPrompt(
    project: IProject,
    language: string,
    leadInfo: {
      name?: string;
      unitType?: string;
      lastIntent?: LeadIntent;
    },
    followupType: 'hot' | 'warm' | 'cold'
  ): string {
    const context = GroundingService.groundProjectData(project, language as any);
    const constraints = GroundingService.getConstraints();
    
    const userName = leadInfo.name ? ` ${leadInfo.name}` : '';
    const unitType = leadInfo.unitType || 'available units';
    
    let followupGuidance = '';
    
    switch (followupType) {
      case 'hot':
        followupGuidance = 'Send a quick followup to check if they have questions. Offer to connect with sales team.';
        break;
      case 'warm':
        followupGuidance = 'Send a gentle followup, share any updates if available, remind about limited availability.';
        break;
      case 'cold':
        followupGuidance = 'Send a polite check-in, ask if they need more information.';
        break;
    }
    
    return `
${context}

${constraints.join('\n')}

FOLLOWUP GUIDANCE: ${followupGuidance}

LEAD INFORMATION:
- Name: ${userName.trim()}
- Interested in: ${unitType}
- Last inquiry: ${leadInfo.lastIntent || 'General inquiry'}

YOUR TASK: Write a followup message for this lead.
Message should be personalized if name is available.
Mention the project name.
Do not sound pushy or salesy.
Keep it under 2 sentences.

YOUR FOLLOWUP MESSAGE:
    `.trim();
  }
}
