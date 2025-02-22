import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, signOut, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">QuizGenius</span>
              </Link>
            </div>

            <div className="flex items-center">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Dashboard
                  </Link>
                  <div className="relative group">
                    <div className="relative inline-block">
                      <button className="flex items-center space-x-2">
                        <img
                          src={currentUser.profilePicture || 'https://via.placeholder.com/40'}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-gray-700">{currentUser.name}</span>
                      </button>
                      <div 
                        className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible 
                          group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-in-out
                          transform group-hover:translate-y-0 translate-y-[-10px]
                          before:absolute before:top-[-20px] before:left-0 before:w-full before:h-[20px] before:bg-transparent"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-gray-800 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 ">
        {children}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} QuizGenius. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}; 