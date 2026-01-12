import React, { useState } from 'react';
import { AppView, UserProfile } from '../types';
import { 
  BookOpen, 
  MessageSquare, 
  PenTool, 
  Calendar, 
  Menu, 
  X, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  GraduationCap
} from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
  profile: UserProfile;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, profile, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(view);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
        currentView === view
          ? 'bg-primary-100 text-primary-600 font-semibold dark:bg-primary-600 dark:text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white dark:bg-slate-800 shadow-sm z-20 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <GraduationCap className="text-primary-500 w-6 h-6" />
           <span className="font-display font-bold text-xl text-primary-600 dark:text-primary-400">EduGenie</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 shadow-xl md:shadow-none z-40 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="text-primary-500 w-8 h-8" />
            <span className="font-display font-bold text-2xl text-primary-600 dark:text-primary-400">EduGenie</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 mb-6">
          <div className="p-4 bg-pastel-blue dark:bg-slate-700 rounded-2xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Welcome</p>
            <p className="font-bold text-lg text-slate-800 dark:text-white truncate">{profile.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Class {profile.classLevel} • {profile.board}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          <NavItem view={AppView.DOUBT} icon={MessageSquare} label="Ask Doubt" />
          <NavItem view={AppView.NOTES} icon={BookOpen} label="Notes Generator" />
          <NavItem view={AppView.QUIZ} icon={PenTool} label="Quiz Master" />
          <NavItem view={AppView.PLANNER} icon={Calendar} label="Study Planner" />
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            {isDark ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col pt-16 md:pt-0 relative">
         {/* Top decoration */}
         <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-primary-50 to-pastel-purple dark:from-slate-800 dark:to-slate-900 -z-10" />
         
         <div className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="max-w-4xl mx-auto h-full">
             {children}
           </div>
         </div>
      </main>
    </div>
  );
};
