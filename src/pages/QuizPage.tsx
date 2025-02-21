import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Quiz, QuizResult } from '../types';

export const QuizPage = () => {
  const { projectId, quizId } = useParams<{ projectId: string; quizId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;

      try {
        const quizRef = doc(db, 'quizzes', quizId);
        const quizSnap = await getDoc(quizRef);

        if (quizSnap.exists()) {
          setQuiz({
            ...quizSnap.data(),
            quizId: quizSnap.id,
          } as Quiz);
        } else {
          setError('Quiz not found');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswerIndex) {
        correctAnswers++;
      }
    });
    return (correctAnswers / quiz.questions.length) * 100;
  };

  const handleSubmit = async () => {
    if (!quiz || !currentUser || !quizId) return;

    try {
      const finalScore = calculateScore();
      setScore(finalScore);

      const quizResult: QuizResult = {
        userId: currentUser.uid,
        score: finalScore,
        answers: selectedAnswers.map((answer, index) => ({
          questionIndex: index,
          selectedAnswer: answer,
          isCorrect: answer === quiz.questions[index].correctAnswerIndex,
        })),
        completedAt: new Date(),
      };

      // Update quiz document with results
      await updateDoc(doc(db, 'quizzes', quizId), {
        results: arrayUnion(quizResult),
      });

      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Quiz Completed!
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                You scored {score.toFixed(1)}%
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => navigate(`/projects/${projectId}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Return to Project
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {quiz.questions.map((question, index) => (
            <div key={index} className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-md font-medium text-gray-900">
                  Question {index + 1}
                </h4>
                <p className="mt-2 text-sm text-gray-500">{question.questionText}</p>
                <div className="mt-4 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-md ${
                        optionIndex === question.correctAnswerIndex
                          ? 'bg-green-50 border border-green-200'
                          : optionIndex === selectedAnswers[index]
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      <p className="text-sm">{option}</p>
                    </div>
                  ))}
                </div>
                {selectedAnswers[index] !== question.correctAnswerIndex && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900">Explanation:</p>
                    <p className="text-sm text-gray-500">{question.explanation.reason}</p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        References: {question.explanation.references.join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h1>
          <div className="text-sm text-gray-500">
            {((currentQuestion + 1) / quiz.questions.length * 100).toFixed(0)}% Complete
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            {quiz.questions[currentQuestion].questionText}
          </h2>
          <div className="mt-4 space-y-2">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-500'
                }`}
              >
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentQuestion === 0
              ? 'text-gray-400 bg-gray-50'
              : 'text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedAnswers.length !== quiz.questions.length}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${
              selectedAnswers.length !== quiz.questions.length
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${
              selectedAnswers[currentQuestion] === undefined
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}; 