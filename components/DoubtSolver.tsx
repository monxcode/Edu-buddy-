import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UserProfile, ChatMessage } from '../types';
import { GeminiService } from '../services/gemini';
import { Send, Mic, Image as ImageIcon, X, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

export const DoubtSolver: React.FC<Props> = ({ profile }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [funnyMode, setFunnyMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = profile.language === 'Hindi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + " " : "") + transcript);
      };
      
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const responseText = await GeminiService.solveDoubt(userMsg.text, userMsg.image || null, profile, funnyMode);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white">Ask Doubt</h2>
          <p className="text-gray-500 dark:text-gray-400">AI Tutor for Class {profile.classLevel}</p>
        </div>
        
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm border border-gray-100 dark:border-slate-700">
           <button 
             onClick={() => setFunnyMode(false)}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!funnyMode ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-500'}`}
           >
             Normal
           </button>
           <button 
             onClick={() => setFunnyMode(true)}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center ${funnyMode ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'text-gray-500'}`}
           >
             <Sparkles className="w-3 h-3 mr-1" />
             Fun Mode
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-slate-700 p-4 mb-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
             <div className="w-20 h-20 bg-primary-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
               <MessageSquare className="w-8 h-8 text-primary-400" />
             </div>
             <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No doubts yet?</h3>
             <p className="text-sm text-gray-500 max-w-xs">Ask anything! "Explain Photosynthesis", "Solve this math problem", or upload a photo.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-gray-100 dark:border-slate-600 rounded-tl-none shadow-sm'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="User upload" className="max-w-full h-auto rounded-lg mb-3 border border-white/20" />
                )}
                <div className={`markdown-body text-sm md:text-base ${msg.role === 'user' ? 'text-white' : 'dark:text-slate-200'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-none p-4 border border-gray-100 dark:border-slate-600 shadow-sm flex items-center space-x-2">
               <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
               <span className="text-sm text-gray-500 dark:text-gray-400">EduGenie is thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg border border-gray-100 dark:border-slate-700 shrink-0">
        {selectedImage && (
          <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100 dark:border-slate-700 mb-2">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center">
              <ImageIcon className="w-3 h-3 mr-1" /> Image attached
            </span>
            <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2 p-2">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0"
             title="Upload Image"
           >
             <ImageIcon className="w-5 h-5" />
             <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
           </button>
           
           <button 
             onClick={startListening}
             className={`p-3 rounded-xl transition-colors shrink-0 ${
               isListening 
                 ? 'bg-red-50 text-red-500 animate-pulse ring-1 ring-red-500' 
                 : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'
             }`}
             title="Voice Input"
           >
             <Mic className="w-5 h-5" />
           </button>

           <textarea
             value={input}
             onChange={e => setInput(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="Type your doubt here..."
             className="flex-1 max-h-32 bg-transparent border-0 focus:ring-0 text-slate-800 dark:text-white placeholder-gray-400 resize-none py-3"
             rows={1}
             style={{ minHeight: '44px' }}
           />

           <button
             onClick={handleSend}
             disabled={(!input.trim() && !selectedImage) || isLoading}
             className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-lg shadow-primary-500/20"
           >
             <Send className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
};