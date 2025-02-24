# QuizGenius - AI-Powered Quiz Generation Platform

QuizGenius is an innovative web application developed during .devHacks 2025 that leverages AI to automatically generate quizzes from project documentation and learning materials. Built with React, Firebase, and Google's Gemini AI, it helps users create engaging learning experiences from their project knowledge.

## 🌟 Features

- **AI-Powered Quiz Generation**: Automatically generates multiple-choice questions from uploaded documents
- **Smart Content Analysis**: Uses Gemini AI to understand context and create relevant questions
- **Multiple File Support**: Handles PDF, DOCX, and TXT files
- **Customizable Quizzes**: Configure difficulty levels and number of questions
- **Instant Feedback**: Get detailed explanations and references for each answer
- **Progress Tracking**: Track quiz results and learning progress

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase Cloud Functions
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth (Google Sign-in)
- **AI**: Google Gemini AI
- **File Processing**: pdf-parse, mammoth (for DOCX)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Yarn (v1.22 or higher)
- Firebase CLI
- Google Cloud account with Gemini API access
- Firebase project with Firestore, Storage, and Functions enabled

### Installing Prerequisites

1. **Install Node.js**:
   - Download and install from [Node.js official website](https://nodejs.org/)
   - Verify installation:

     ```bash
     node --version
     ```

2. **Install Yarn**:

   ```bash
   npm install -g yarn
   # Verify installation
   yarn --version
   ```

3. **Install Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   # Login to Firebase
   firebase login
   # Verify installation
   firebase --version
   ```

4. **Firebase Project Setup**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing project
   - Enable required services:
     - Authentication (Google Sign-in)
     - Firestore Database
     - Storage
     - Functions
   - Create a new web app in the project and get your app configuration (for .env file)

5. **Gemini AI**:
   <!-- - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Cloud Functions API
   - Create a service account and download credentials -->
   - Get Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/quiz-genius.git
   cd quiz-genius
   ```

2. Install root project dependencies (using yarn):

   ```bash
   yarn install
   ```

3. Install Cloud Functions dependencies (using npm):

   ```bash
   cd functions
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. Create a `.env` file in the functions directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GCLOUD_STORAGE_BUCKET=your-firebase-storage-bucket
   ```

6. Build and deploy Firebase Functions, firestore rules, and storage rules:

   ```bash
   firebase deploy --project <alias_or_project_id>
   ```

7. Start the development server (in root directory):

   ```bash
   yarn dev
   ```

## 📝 Usage

1. Sign in with your Google account
2. Create a new project
3. Upload project documentation (PDF, DOCX, or TXT)
4. Configure quiz parameters (difficulty, number of questions)
5. Generate and take the quiz
6. Review results and explanations

## 🔒 Security Features

- Secure file uploads with type and size validation
- Firebase Security Rules for Firestore and Storage
- Protected API routes with authentication
- User-specific data access control

## 🤖 AI Integration

The project uses Google's Gemini AI with the following capabilities:

- Content understanding and analysis
- Question generation with context awareness
- Multiple choice option generation
- Explanation generation with source references

## 🏗️ Project Structure

```plaintext
quiz-genius/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── pages/         # Page components
│   ├── services/      # Firebase services
│   ├── types/         # TypeScript interfaces
│   └── utils/         # Utility functions
├── functions/         # Firebase Cloud Functions
├── public/           # Static assets
└── firebase.json     # Firebase configuration
```

## 🛡️ Firebase Security Rules

The project includes security rules for both Firestore and Storage to ensure data protection and access control.

## 👥 Team

- Jackie - [(Jackie-v2)](https://github.com/Jackie-v2)
- David - [(Xiaoran Meng)](https://github.com/xiaoran-MENG)
- Gigi - [(Gigi)](https://github.com/shop2008)
- Hamilton - [(Sneezy-w)](https://github.com/Sneezy-w)

## 🎯 Future Improvements

- [ ] Support for more file formats
- [ ] Advanced quiz customization options
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Export quiz results
- [ ] Mobile app version

## 🙏 Acknowledgments

- Google Cloud Platform
- Firebase Team
- Gemini AI Team
- .devHacks 2025 Organizers and Mentors
