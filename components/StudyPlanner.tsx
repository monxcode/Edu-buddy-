import React, { useState } from 'react';
import { UserProfile, StudySession } from '../types';
import { GeminiService } from '../services/gemini';
import { Calendar, Clock, Loader2, Plus, X } from 'lucide-react';

export const StudyPlanner: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [currSubject, setCurrSubject] = useState('');
  const [hours, setHours] = useState(4);
  const [plan, setPlan] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(false);

  const addSubject = () => {
    if (currSubject && !subjects.includes(currSubject)) {
      setSubjects([...subjects, currSubject]);
      setCurrSubject('');
    }
  };

  const generate = async () => {
    if (subjects.length === 0) return;
    setLoading(true);
    const result = await GeminiService.generateStudyPlan(hours, subjects, profile);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white">Smart Study Planner</h2>
        <p className="text-gray-500 dark:text-gray-400">Design a perfect schedule balanced for your goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Subjects to Focus On
            </label>
            <div className="flex gap-2 mb-4">
              <input 
                value={currSubject}
                onChange={e => setCurrSubject(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSubject()}
                placeholder="e.g. Math, Physics"
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl outline-none dark:text-white"
              />
              <button onClick={addSubject} className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl hover:bg-primary-200 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {subjects.map(s => (
                <span key={s} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg flex items-center">
                  {s}
                  <button onClick={() => setSubjects(subjects.filter(sub => sub !== s))} className="ml-2 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {subjects.length === 0 && <p className="text-sm text-gray-400 italic">No subjects added yet.</p>}
            </div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Study Hours per Day: {hours}h
            </label>
            <input 
              type="range" 
              min="1" 
              max="12" 
              value={hours} 
              onChange={e => setHours(parseInt(e.target.value))}
              className="w-full accent-primary-500 mb-6"
            />

            <button
              onClick={generate}
              disabled={loading || subjects.length === 0}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all flex justify-center items-center disabled:bg-gray-300"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Generate Schedule"}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2">
          {plan.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-400">
              <Calendar className="w-12 h-12 mb-3 opacity-50" />
              <p>Your personalized timetable will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {plan.map((dayPlan, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                  <h3 className="font-bold text-lg text-primary-600 dark:text-primary-400 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-primary-500 rounded-full mr-3"></div>
                    {dayPlan.day}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {dayPlan.sessions.map((session, sIdx) => (
                      <div key={sIdx} className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {session.time}
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-white">{session.subject}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{session.topic}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
