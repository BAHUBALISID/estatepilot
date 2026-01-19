export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const extractKeywords = (text: string): string[] => {
  const normalized = normalizeText(text);
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'है', 'हैं', 'था', 'थी', 'थे', 'का', 'की', 'के', 'को', 'से', 'में', 'पर'
  ]);
  
  return normalized
    .split(' ')
    .filter(word => word.length > 2 && !stopWords.has(word));
};

export const detectIntentFromText = (text: string): string => {
  const keywords = extractKeywords(text);
  const { INTENT_KEYWORDS } = require('../constants/intents');
  
  for (const [intent, patterns] of Object.entries(INTENT_KEYWORDS)) {
    for (const pattern of patterns as string[]) {
      if (keywords.some(keyword => keyword.includes(pattern.toLowerCase()))) {
        return intent;
      }
    }
  }
  
  return 'UNKNOWN';
};
