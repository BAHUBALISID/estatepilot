import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.string().transform(Number).default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  
  // Database
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('7d'),
  
  // Gemini AI
  GEMINI_API_KEY: z.string(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  
  // WhatsApp
  WHATSAPP_ACCESS_TOKEN: z.string(),
  WHATSAPP_BUSINESS_ID: z.string(),
  WHATSAPP_PHONE_NUMBER_ID: z.string(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string(),
  
  // Admin
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
