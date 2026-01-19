import { env } from './env';

export interface WhatsAppConfig {
  accessToken: string;
  businessId: string;
  phoneNumberId: string;
  apiVersion: string;
  webhookVerifyToken: string;
}

export const whatsappConfig: WhatsAppConfig = {
  accessToken: env.WHATSAPP_ACCESS_TOKEN,
  businessId: env.WHATSAPP_BUSINESS_ID,
  phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
  apiVersion: 'v19.0',
  webhookVerifyToken: env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
};

export const WHATSAPP_API_BASE_URL = `https://graph.facebook.com/${whatsappConfig.apiVersion}`;

export const WHATSAPP_MESSAGE_TYPES = {
  TEXT: 'text',
  TEMPLATE: 'template',
  INTERACTIVE: 'interactive',
} as const;

export const QUALIFICATION_TEMPLATES = {
  BUDGET: 'budget_qualification',
  UNIT_TYPE: 'unit_type_qualification',
  TIMELINE: 'timeline_qualification',
  LOCATION: 'location_preference',
  AMENITIES: 'amenities_interest',
} as const;
