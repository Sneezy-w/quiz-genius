import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage = () => {
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl animate-fade-in">
              Generate AI-Powered Quizzes from Your Project Knowledge
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in-up">
              Transform your project documentation into engaging quizzes. Upload your content,
              configure quiz parameters, and let our AI create personalized learning experiences.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {currentUser ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 animate-fade-in-up"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 animate-fade-in-up"
                >
                  Get started with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gradient-to-b from-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 animate-fade-in">
              Faster Learning
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-fade-in">
              Everything you need to create effective quizzes
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="p-6 flex-1">
                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                      {feature.title}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                  <div className="bg-indigo-50 px-6 py-4 rounded-b-xl">
                    <div className="text-sm text-indigo-600 font-medium">
                      {feature.highlight}
                    </div>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "AI-Powered Generation",
    description: "Upload your project documentation and let our AI create relevant, challenging questions automatically.",
    highlight: "Powered by Google's Gemini AI"
  },
  {
    title: "Customizable Difficulty",
    description: "Choose the difficulty level and number of questions to match your learning goals.",
    highlight: "Multiple difficulty levels available"
  },
  {
    title: "Detailed Explanations",
    description: "Get comprehensive explanations for each answer, with references to your original content.",
    highlight: "Context-aware feedback"
  }
]; 