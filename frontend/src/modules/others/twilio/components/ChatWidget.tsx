import React from 'react';
import { useChat } from '../context/ChatContext';
import { X, ArrowLeft } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const { isOpen, closeChat, shopName } = useChat();

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 sm:hidden transition-opacity duration-300 backdrop-blur-[2px] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeChat} 
      />

      {/* Chat Container - Modern Floating Glass Card */}
      <div className={`fixed z-50 flex flex-col bg-white/95 sm:bg-white/90 backdrop-blur-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] sm:border sm:border-white/50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        bottom-[calc(env(safe-area-inset-bottom)+16px)] left-4 right-4 h-[75vh] rounded-3xl overflow-hidden
        sm:bottom-24 sm:right-6 sm:left-auto sm:w-[340px] sm:h-[420px] sm:rounded-2xl
        origin-bottom sm:origin-bottom-right
        ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 sm:translate-y-16 scale-95 pointer-events-none'}
      `}>
        
        {/* Header - Minimalist */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/60">
          <div className="flex items-center gap-3">
            {/* Avatar placeholder */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
              {shopName ? shopName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight truncate max-w-[150px] sm:max-w-[180px]">{shopName || 'Chat'}</h3>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Đang trực tuyến
              </p>
            </div>
          </div>
          
          <button 
            onClick={closeChat} 
            className="w-9 h-9 flex items-center justify-center bg-slate-100/80 hover:bg-slate-200 text-slate-600 rounded-full transition-colors backdrop-blur-sm cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center max-w-[80%] border border-slate-100">
            <span className="text-2xl mb-2 block">👋</span>
            <p className="text-sm text-slate-600 font-medium">
              Kết nối với {shopName || 'Shop'}...
            </p>
            <p className="text-xs text-slate-400 mt-1">
              (Đang chờ tích hợp API)
            </p>
          </div>
        </div>
        
        {/* Chat Footer - Input */}
        <div className="p-3 bg-white/80 border-t border-slate-100">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Nhắn tin ngay..." 
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-slate-700 placeholder-slate-400 shadow-inner transition-all"
            />
            <button className="absolute right-1.5 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 translate-x-px -translate-y-px">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
