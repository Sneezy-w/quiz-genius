/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
//import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.GCLOUD_PROJECT
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface QuizConfig {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  numberOfQuestions: number;
}

interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: {
    reason: string;
    references: string[];
  };
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdf.default(buffer);
  return data.text;
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function generateQuizQuestions(
  content: string,
  config: QuizConfig
): Promise<QuizQuestion[]> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            questionText: {
              type: SchemaType.STRING,
              description: "The question text"
            },
            options: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.STRING,
              },
              description: "Array of 4 possible answers"
            },
            correctAnswerIndex: {
              type: SchemaType.INTEGER,
              description: "Index of the correct answer (0-3)"
            },
            explanation: {
              type: SchemaType.OBJECT,
              properties: {
                reason: {
                  type: SchemaType.STRING,
                  description: "Explanation for why the answer is correct"
                },
                references: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.STRING,
                  },
                  description: "References from the source content"
                }
              },
              required: ["reason", "references"]
            }
          },
          required: ["questionText", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  const prompt = `Generate a multiple-choice quiz based on the following content.
    
    Requirements:
    - Difficulty level: ${config.difficulty}
    - Generate exactly ${config.numberOfQuestions} questions
    - Each question must have exactly 4 options
    - One option must be correct, three must be incorrect
    - Include detailed explanation for the correct answer
    - Reference specific parts of the content in the explanation
    
    Content to generate questions from:
    ${content}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const parsedQuestions = JSON.parse(text) as QuizQuestion[];
    return parsedQuestions;
  } catch (error) {
    console.error('Error generating or parsing quiz questions:', error);
    throw new Error('Failed to generate valid quiz questions. Please try again.');
  }
}

// Set global options
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1" // or your preferred region
});

// Update the function declaration
export const generateQuiz = onCall(async (request) => {
  // Check authentication
  if (!request.auth) {
    throw new Error('The function must be called while authenticated.');
  }

  const { projectId, config } = request.data;
  
  try {
    // Get project details
    const projectDoc = await admin.firestore().collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error('Project not found');
    }

    const projectData = projectDoc.data()!;
    
    // Check authorization
    if (projectData.userId !== request.auth.uid) {
      throw new Error('Only project owner can generate quizzes');
    }

    // Get the project knowledge file
    const fileUrl = projectData.knowledgeURL;
    if (!fileUrl) {
      throw new Error('No project knowledge file found');
    }

    // Download the file
    const bucket = admin.storage().bucket(process.env.GCLOUD_STORAGE_BUCKET);
    const filePath = fileUrl.split('/o/')[1].split('?')[0];
    const [fileContent] = await bucket.file(decodeURIComponent(filePath)).download();

    // Extract text based on file type
    let content = '';
    if (filePath.endsWith('.pdf')) {
      content = await extractTextFromPDF(fileContent);
    } else if (filePath.endsWith('.docx')) {
      content = await extractTextFromDOCX(fileContent);
    } else {
      // Assume text file
      content = fileContent.toString('utf-8');
    }

    // Generate quiz questions
    const questions = await generateQuizQuestions(content, config);

    // Create quiz document
    const quizData = {
      projectId,
      config,
      questions,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      results: [],
    };

    const quizRef = await admin.firestore().collection('quizzes').add(quizData);

    // Update project with quiz reference
    await projectDoc.ref.update({
      quizGenerated: true,
      quizId: quizRef.id,
    });

    return { quizId: quizRef.id };
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
