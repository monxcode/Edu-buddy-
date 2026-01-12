export interface UserProfile {
  name: string;
  classLevel: string;
  board: string;
  stream?: string; // For class 11-12
  language: 'English' | 'Hindi' | 'Hinglish';
  onboarded: boolean;
}

export enum AppView {
  HOME = 'HOME',
  DOUBT = 'DOUBT',
  NOTES = 'NOTES',
  QUIZ = 'QUIZ',
  PLANNER = 'PLANNER',
  SETTINGS = 'SETTINGS',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface StudySession {
  day: string;
  sessions: {
    time: string;
    subject: string;
    topic: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: number;
}
