import crypto from 'crypto';

export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const hashString = (text: string): string => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

export const verifySignature = (
  payload: Buffer,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
