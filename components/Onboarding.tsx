import React, { useState } from 'react';
import { UserProfile } from '../types';
import { GraduationCap, ArrowRight, Book } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    language: 'English',
    board: 'CBSE'
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onComplete({
        ...formData as UserProfile,
        onboarded: true
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-primary-100 w-full">
          <div 
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2">
            Welcome to EduGenie
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Your AI Study Companion</p>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What's your name?</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Enter your name"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Which Class are you in?</label>
               <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.classLevel || ''}
                  onChange={e => setFormData({ ...formData, classLevel: e.target.value })}
               >
                 <option value="">Select Class</option>
                 {[...Array(12)].map((_, i) => (
                   <option key={i} value={`${i + 1}`}>Class {i + 1}</option>
                 ))}
                 <option value="Competitive Exam">Competitive Aspirant</option>
               </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select your Board</label>
               <div className="grid grid-cols-2 gap-3">
                 {['CBSE', 'ICSE', 'State Board', 'Other'].map(board => (
                   <button
                     key={board}
                     onClick={() => setFormData({ ...formData, board })}
                     className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                       formData.board === board
                         ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                         : 'border-gray-200 text-gray-600 dark:border-slate-600 dark:text-gray-300 hover:bg-gray-50'
                     }`}
                   >
                     {board}
                   </button>
                 ))}
               </div>
             </div>
             {(formData.classLevel === '11' || formData.classLevel === '12') && (
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stream</label>
                 <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none"
                    value={formData.stream || ''}
                    onChange={e => setFormData({ ...formData, stream: e.target.value })}
                 >
                   <option value="">Select Stream</option>
                   <option value="Science (PCM)">Science (PCM)</option>
                   <option value="Science (PCB)">Science (PCB)</option>
                   <option value="Commerce">Commerce</option>
                   <option value="Arts/Humanities">Arts/Humanities</option>
                 </select>
               </div>
             )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preferred Language</label>
               <div className="space-y-3">
                 {[
                   { id: 'English', label: 'English', desc: 'All explanations in English' },
                   { id: 'Hindi', label: 'Hindi', desc: 'हिंदी में स्पष्टीकरण' },
                   { id: 'Hinglish', label: 'Hinglish', desc: 'Mix of Hindi & English (Best for understanding)' }
                 ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setFormData({ ...formData, language: lang.id as any })}
                      className={`w-full flex items-center p-3 rounded-xl border transition-all text-left ${
                        formData.language === lang.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                          : 'border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                         formData.language === lang.id ? 'border-primary-500' : 'border-gray-400'
                      }`}>
                        {formData.language === lang.id && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white">{lang.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang.desc}</div>
                      </div>
                    </button>
                 ))}
               </div>
             </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
           <button
             disabled={!formData.name && step === 1}
             onClick={handleNext}
             className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30"
           >
             {step === 3 ? 'Get Started' : 'Next'}
             <ArrowRight className="w-5 h-5 ml-2" />
           </button>
        </div>
      </div>
    </div>
  );
};
