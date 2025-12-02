export enum TranslationDirection {
  CN_TO_UNI = 'CN_TO_UNI',
  UNI_TO_CN = 'UNI_TO_CN'
}

export interface TranslationResponse {
  original: string;
  translated: string;
  ipa: string; // International Phonetic Alphabet
  morphologyBreakdown: string[]; // Explanation of word parts
  grammarNotes: string;
}

export interface HistoryItem extends TranslationResponse {
  id: string;
  timestamp: number;
  direction: TranslationDirection;
}

export interface UniversaliaRule {
  category: string;
  title: string;
  description: string;
  example: string;
}