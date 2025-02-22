import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage = () => {
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
  <div className="relative bg-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-blue-700" />
      <div className="absolute right-[-12%] bottom-[-12%] w-1/4 h-1/4">
        <div className="relative w-full h-full">
          <div className="absolute right-0 bottom-0 w-full h-[200%] bg-coral-500 rounded-tl-full animate-wave" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-20 lg:py-32">
          {/* Left content */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Generate AI-Powered Quizzes from Your Project Knowledge
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your project documentation into engaging quizzes. Upload your content,
              configure quiz parameters, and let our AI create personalized learning experiences.
            </p>
            <div className="flex gap-4">
              {currentUser ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-blue-700 text-white rounded-md text-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="px-8 py-4 bg-blue-700 text-white rounded-md text-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Get started with Google
                </button>
              )}
            </div>
          </div>

          {/* Right image */}
          <div className="w-full lg:w-1/2 lg:pl-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="Modern learning environment"
                className="w-full h-auto"
              />
            </div>
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