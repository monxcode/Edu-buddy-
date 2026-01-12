import React, { useState } from 'react';
import { UserProfile, QuizQuestion } from '../types';
import { GeminiService } from '../services/gemini';
import { Loader2, CheckCircle, XCircle, Trophy, RefreshCw, ChevronRight } from 'lucide-react';

export const QuizMaker: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions([]); // Clear old
    setQuizCompleted(false);
    setScore(0);
    setCurrentQIndex(0);
    
    const qs = await GeminiService.generateQuiz(topic, 5, profile);
    setQuestions(qs);
    setLoading(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === questions[currentQIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // 1. Input State
  if (questions.length === 0 && !quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center pt-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-4">Quiz Master</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Test your knowledge. Enter a topic and we'll generate a unique quiz for you.</p>
          
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g. Thermodynamics, Algebra)"
            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl mb-4 focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
          />
          
          <button
            onClick={startQuiz}
            disabled={loading || !topic}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/30 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Start Quiz"}
          </button>
        </div>
      </div>
    );
  }

  // 2. Result State
  if (quizCompleted) {
    return (
      <div className="max-w-md mx-auto text-center pt-10">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">
          <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-6 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Quiz Completed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You scored</p>
          
          <div className="text-6xl font-black text-primary-600 dark:text-primary-400 mb-8">
            {score}/{questions.length}
          </div>

          <button
            onClick={() => { setQuestions([]); setTopic(''); }}
            className="w-full bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center hover:bg-slate-900 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Another Topic
          </button>
        </div>
      </div>
    );
  }

  // 3. Question State
  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Question {currentQIndex + 1} of {questions.length}
        </span>
        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-bold">
          Score: {score}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-slate-700 relative overflow-hidden">
        {/* Progress bar top */}
        <div className="absolute top-0 left-0 h-1.5 bg-gray-100 dark:bg-slate-700 w-full">
          <div 
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-8 mt-2 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let stateClass = "border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700";
            if (selectedOption !== null) {
              if (idx === currentQ.correctAnswer) stateClass = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
              else if (idx === selectedOption) stateClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
              else stateClass = "border-gray-200 dark:border-slate-600 opacity-50";
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-700 dark:text-slate-200 flex justify-between items-center ${stateClass}`}
              >
                <span>{opt}</span>
                {selectedOption !== null && idx === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 animate-fade-in">
            <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-xl mb-4">
              <p className="font-bold text-blue-800 dark:text-blue-300 mb-1">Explanation:</p>
              <p className="text-blue-700 dark:text-blue-200 text-sm">{currentQ.explanation}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={nextQuestion}
                className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center hover:bg-slate-800 transition-colors"
              >
                {currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
