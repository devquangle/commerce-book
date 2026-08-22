import React from 'react';
import { useChat } from '../context/ChatContext';
import { X } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const { isOpen, closeChat } = useChat();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-medium">Chat</h3>
        <button onClick={closeChat} className="p-1 hover:bg-blue-700 rounded transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-center text-sm text-gray-500">
          Chưa kết nối Backend.<br/>
          (Cần gọi API lấy Twilio Token)
        </p>
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <input 
          type="text" 
          placeholder="Nhập tin nhắn..." 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
          disabled
        />
      </div>
    </div>
  );
};
