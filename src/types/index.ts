import { Timestamp } from "@firebase/firestore";

export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  profilePicture?: string;
}

export interface Project {
  projectId: string;
  userId: string;
  projectName: string;
  description: string;
  knowledgeURL: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  quizGenerated?: boolean;
  quizIds: string[];
}

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: {
    reason: string;
    references: string[];
  };
}

export interface Quiz {
  quizId: string;
  projectId: string;
  config: {
    difficulty: "Easy" | "Medium" | "Hard";
    numberOfQuestions: number;
  };
  questions: QuizQuestion[];
  generatedAt: Date;
  results?: QuizResult[];
}

export interface QuizResult {
  userId: string;
  score: number;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  completedAt: Date;
}
