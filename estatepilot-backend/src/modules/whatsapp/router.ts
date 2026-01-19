import { Router } from 'express';
import {
  handleWebhookVerification,
  handleIncomingMessage
} from './webhook.controller';

const router = Router();

// WhatsApp webhook routes
router.get('/webhook/whatsapp', handleWebhookVerification);
router.post('/webhook/whatsapp', handleIncomingMessage);

// Test route to send message
router.post('/send-message', async (req, res) => {
  // Protected route for admin to send test messages
  // Implementation depends on your auth setup
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
