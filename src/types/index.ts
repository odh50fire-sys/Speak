export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type ThemeId = 'cheese' | 'strawberry' | 'soda' | 'mint' | 'lavender';

export type ScreenMode = 'lobby' | 'chat' | 'review';

export interface Persona {
  id: string;
  name: string;
  emoji: string;
  avatarBg: string;
  role: string;
  tagline: string;
  greeting: string;
  voiceGender: 'female' | 'male';
  voicePitch: number;
  voiceRate: number;
}

export interface Situation {
  id: string;
  title: string;
  emoji: string;
  category: 'daily' | 'cafe' | 'travel' | 'friend';
  description: string;
  firstTurnPrompt: string;
  suggestedLevel: DifficultyLevel;
  hiddenQuests: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface CorrectionItem {
  userSentence: string;
  correctedSentence: string;
  nativeAlternative: string;
  explanation: string;
}

export interface ReviewFeedback {
  overallScore: number;
  pingPongScore: number;
  talkDurationTurns: number;
  praisedPoints: string[];
  corrections: CorrectionItem[];
  keyExpressions: Array<{
    phrase: string;
    meaning: string;
    example: string;
  }>;
}

export interface HintOption {
  type: 'easy' | 'natural' | 'pingpong';
  label: string;
  english: string;
  korean: string;
}
