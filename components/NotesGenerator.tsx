import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UserProfile } from '../types';
import { GeminiService } from '../services/gemini';
import { BookOpen, Sparkles, Download, Copy, Check, Loader2 } from 'lucide-react';

export const NotesGenerator: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<'Simple' | 'Exam' | 'Detailed'>('Simple');
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setGeneratedNotes('');
    const notes = await GeminiService.generateNotes(topic, style, profile);
    setGeneratedNotes(notes);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-2">Magic Notes</h2>
        <p className="text-gray-500 dark:text-gray-400">Enter a topic, pick a style, and get instant study material.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., Photosynthesis, Newton's Laws, Mughal Empire..."
            className="flex-1 px-5 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-lg dark:text-white"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center min-w-[160px]"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {['Simple', 'Exam', 'Detailed'].map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all border ${
                style === s
                  ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
              }`}
            >
              {s} Mode
            </button>
          ))}
        </div>
      </div>

      {generatedNotes && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 animate-fade-in relative">
          <div className="absolute top-6 right-6 flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="markdown-body dark:text-gray-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedNotes}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
