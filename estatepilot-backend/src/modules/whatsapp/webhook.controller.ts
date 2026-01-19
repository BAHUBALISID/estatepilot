import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { WhatsAppService } from './whatsapp.service';
import { logger } from '../../config/logger';
import { verifyWebhook, validateWhatsAppSignature } from '../../middlewares/webhookAuth.middleware';

const whatsappService = new WhatsAppService();

export const handleWebhookVerification = [
  verifyWebhook
];

export const handleIncomingMessage = [
  validateWhatsAppSignature,
  asyncHandler(async (req: Request, res: Response) => {
    // Send immediate response to WhatsApp
    res.status(200).send('EVENT_RECEIVED');
    
    // Process the webhook asynchronously
    process.nextTick(async () => {
      try {
        const entries = req.body.entry;
        
        for (const entry of entries) {
          const changes = entry.changes;
          
          for (const change of changes) {
            const value = change.value;
            
            if (value.messages) {
              for (const message of value.messages) {
                await whatsappService.processIncomingMessage(
                  message,
                  value.metadata?.phone_number_id
                );
              }
            }
            
            // Handle status updates
            if (value.statuses) {
              for (const status of value.statuses) {
                logger.info(`Message status update: ${status.status} for ${status.id}`);
              }
            }
          }
        }
      } catch (error) {
        logger.error('Error processing webhook:', error);
      }
    });
  })
];
