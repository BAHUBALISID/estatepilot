import axios from 'axios';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../../middlewares/error.middleware';

export interface GeminiResponse {
  text: string;
  safetyRatings: Array<{
    category: string;
    probability: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GeminiService {
  private apiKey: string;
  private model: string;
  private baseURL: string;
  
  constructor() {
    this.apiKey = env.GEMINI_API_KEY;
    this.model = env.GEMINI_MODEL;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
  }
  
  async generateContent(
    prompt: string,
    temperature: number = 0.3,
    maxOutputTokens: number = 250
  ): Promise<GeminiResponse> {
    try {
      const url = `${this.baseURL}/${this.model}:generateContent`;
      
      const response = await axios.post(
        url,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature,
            maxOutputTokens,
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          }
        }
      );
      
      const candidate = response.data.candidates[0];
      
      if (!candidate || !candidate.content || !candidate.content.parts[0]) {
        throw new AppError('No response generated from Gemini', 500);
      }
      
      // Check for safety blocks
      if (candidate.finishReason === 'SAFETY') {
        logger.warn('Gemini response blocked for safety reasons');
        throw new AppError('Response blocked for safety', 400);
      }
      
      return {
        text: candidate.content.parts[0].text,
        safetyRatings: candidate.safetyRatings || [],
        usageMetadata: response.data.usageMetadata
      };
      
    } catch (error: any) {
      logger.error('Gemini API error:', error.response?.data || error.message);
      
      if (error.response?.data?.error) {
        throw new AppError(
          `Gemini API error: ${error.response.data.error.message}`,
          error.response.status
        );
      }
      
      throw new AppError('Failed to generate AI response', 500);
    }
  }
  
  async generateControlledResponse(
    prompt: string,
    context: string,
    constraints: string[]
  ): Promise<string> {
    const fullPrompt = `
CONTEXT FOR RESPONSE:
${context}

CONSTRAINTS (MUST FOLLOW STRICTLY):
${constraints.map(c => `- ${c}`).join('\n')}

USER QUERY:
${prompt}

YOUR RESPONSE (BE CONCISE, FACTUAL, NO EMOJIS):
    `.trim();
    
    try {
      const response = await this.generateContent(fullPrompt);
      return response.text.trim();
    } catch (error) {
      logger.error('Failed to generate controlled response:', error);
      return "I'll connect you with our team for more information.";
    }
  }
  
  async detectLanguage(text: string): Promise<'en' | 'hi' | 'hinglish'> {
    const prompt = `
    Detect the language of this text. Return only one of: 'en' (English), 'hi' (Hindi), or 'hinglish' (Hindi-English mix).
    
    Text: "${text}"
    
    Language:
    `.trim();
    
    try {
      const response = await this.generateContent(prompt, 0.1, 10);
      const language = response.text.trim().toLowerCase();
      
      if (language.includes('hi') && language.includes('english')) {
        return 'hinglish';
      } else if (language.includes('hi')) {
        return 'hi';
      } else {
        return 'en';
      }
    } catch (error) {
      logger.warn('Language detection failed, defaulting to English');
      return 'en';
    }
  }
}
