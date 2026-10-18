import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ExplorerPage } from './components/ExplorerPage';
import { HeritageDetailsPage } from './components/HeritageDetailsPage';
import { StoryModePage } from './components/StoryModePage';
import { AudioStoryModal } from './components/AudioStoryModal';
import { QuizPage } from './components/QuizPage';
import { QuizResultPage } from './components/QuizResultPage';
import { ArtifactMatchGame } from './components/ArtifactMatchGame';
import { HeritageMemoryGame } from './components/HeritageMemoryGame';
import { MyProgressPage } from './components/MyProgressPage';
import { AchievementsPage } from './components/AchievementsPage';
import { ProfilePage } from './components/ProfilePage';
import { FavoritesPage } from './components/FavoritesPage';
import { LoginPage } from './components/LoginPage';
import { AboutPage } from './components/AboutPage';
import { AdminPanel } from './components/AdminPanel';
import { Toast } from './components/Toast';

const MainContent = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <LandingPage />;
      case 'explore':
        return <ExplorerPage />;
      case 'details':
        return <HeritageDetailsPage />;
      case 'story':
        return <StoryModePage />;
      case 'quiz':
        return <QuizPage />;
      case 'quiz-result':
        return <QuizResultPage />;
      case 'artifact-match':
        return <ArtifactMatchGame />;
      case 'memory-game':
        return <HeritageMemoryGame />;
      case 'progress':
        return <MyProgressPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'login':
        return <LoginPage />;
      case 'about':
        return <AboutPage />;
      case 'admin-dashboard':
      case 'admin-topics':
      case 'admin-story':
      case 'admin-quiz':
      case 'admin-game':
        return <AdminPanel />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-heritage-pattern flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {renderScreen()}
      </main>
      <Footer />
      <AudioStoryModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
