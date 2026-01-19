export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  HINGLISH = 'hinglish'
}

export const LANGUAGE_DETECTION_PATTERNS = {
  hi: [/नमस्ते|कैसे|है|हूं|में|का|की|के|हैं|था|थी|थे/i],
  hinglish: [/hello|hi|hey|kaise|hai|hain|kyu|kya|mein|ke|ki|ka|please|help/i],
  en: [/^[a-zA-Z\s.,!?]+$/]
};

export const DEFAULT_LANGUAGE = Language.ENGLISH;
