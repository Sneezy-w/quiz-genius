export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: Date;
  profilePicture?: string;
}

export interface Project {
  projectId: string;
  userId: string;
  projectName: string;
  description: string;
  knowledgeURL: string;
  createdAt: Date;
  updatedAt: Date;
  quizGenerated?: boolean;
  quizId?: string;
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
    difficulty: 'Easy' | 'Medium' | 'Hard';
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