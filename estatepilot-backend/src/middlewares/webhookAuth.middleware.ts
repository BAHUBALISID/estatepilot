import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { whatsappConfig } from '../config/whatsapp';

export const verifyWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === whatsappConfig.webhookVerifyToken) {
    console.log('Webhook verified successfully');
    res.status(200).send(challenge);
    return;
  }
  
  res.status(403).send('Verification failed');
};

export const validateWhatsAppSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers['x-hub-signature-256'] as string;
  
  if (!signature) {
    res.status(401).json({ error: 'No signature provided' });
    return;
  }
  
  const rawBody = JSON.stringify(req.body);
  const expectedSignature = 'sha256=' + 
    crypto
      .createHmac('sha256', whatsappConfig.accessToken)
      .update(rawBody)
      .digest('hex');
  
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }
  
  next();
};
