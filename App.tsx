import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { DoubtSolver } from './components/DoubtSolver';
import { NotesGenerator } from './components/NotesGenerator';
import { QuizMaker } from './components/QuizMaker';
import { StudyPlanner } from './components/StudyPlanner';
import { AppView, UserProfile } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DOUBT);

  useEffect(() => {
    const saved = localStorage.getItem('edugenie_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('edugenie_profile', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    localStorage.removeItem('edugenie_profile');
    setProfile(null);
  };

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DOUBT:
        return <DoubtSolver profile={profile} />;
      case AppView.NOTES:
        return <NotesGenerator profile={profile} />;
      case AppView.QUIZ:
        return <QuizMaker profile={profile} />;
      case AppView.PLANNER:
        return <StudyPlanner profile={profile} />;
      default:
        return <DoubtSolver profile={profile} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView} 
      profile={profile}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
