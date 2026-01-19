import { LANGUAGE_DETECTION_PATTERNS, Language } from '../constants/languages';

export const detectLanguage = (text: string): Language => {
  const normalizedText = text.toLowerCase();
  
  // Check for Hindi patterns
  if (LANGUAGE_DETECTION_PATTERNS.hi.some(pattern => pattern.test(normalizedText))) {
    return Language.HINDI;
  }
  
  // Check for Hinglish patterns (mixed Hindi-English)
  if (LANGUAGE_DETECTION_PATTERNS.hinglish.some(pattern => pattern.test(normalizedText))) {
    return Language.HINGLISH;
  }
  
  // Default to English
  return Language.ENGLISH;
};

export const getLanguageCode = (language: Language): string => {
  switch (language) {
    case Language.HINDI:
      return 'hi';
    case Language.HINGLISH:
      return 'hinglish';
    default:
      return 'en';
  }
};

export const translateTemplate = (
  templateKey: string,
  language: Language,
  params: Record<string, string> = {}
): string => {
  const { SALUTATION_TEMPLATES, QUALIFICATION_QUESTIONS, ESCALATION_TEMPLATES } = 
    require('../constants/templates');
  
  let templateSet;
  
  if (templateKey in SALUTATION_TEMPLATES) {
    templateSet = SALUTATION_TEMPLATES[templateKey as keyof typeof SALUTATION_TEMPLATES];
  } else if (templateKey in QUALIFICATION_QUESTIONS) {
    templateSet = QUALIFICATION_QUESTIONS[templateKey as keyof typeof QUALIFICATION_QUESTIONS];
  } else if (templateKey in ESCALATION_TEMPLATES) {
    templateSet = ESCALATION_TEMPLATES[templateKey as keyof typeof ESCALATION_TEMPLATES];
  } else {
    return "I'll connect you with our team.";
  }
  
  const template = templateSet[language] || templateSet['en'];
  let result = template;
  
  // Replace parameters
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  
  return result;
};
