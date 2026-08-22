import React, { useState } from 'react';
import { Send, Phone, MoreVertical, Search } from 'lucide-react';

const mockChats = [
  {
    id: 1,
    name: 'John Doe',
    initials: 'JD',
    color: 'bg-blue-500',
    type: 'SMS',
    lastMessage: "Hello! I'd be happy to help...",
    time: '10:02 AM',
    unread: 0,
    messages: [
      { id: 1, text: "Hi there! I have a question about my recent order.", sender: 'customer', time: '10:00 AM' },
      { id: 2, text: "Hello! I'd be happy to help. Can you provide your order number?", sender: 'shop', time: '10:02 AM' },
    ]
  },
  {
    id: 2,
    name: 'Alice Smith',
    initials: 'AS',
    color: 'bg-green-500',
    type: 'WhatsApp',
    lastMessage: "Is this item available in XL?",
    time: '09:45 AM',
    unread: 2,
    messages: [
      { id: 1, text: "Hi, I love the new jacket.", sender: 'customer', time: '09:40 AM' },
      { id: 2, text: "Is this item available in XL?", sender: 'customer', time: '09:45 AM' },
    ]
  },
  {
    id: 3,
    name: 'Bob Johnson',
    initials: 'BJ',
    color: 'bg-orange-500',
    type: 'SMS',
    lastMessage: "Thanks for the update!",
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, text: "Your order has been shipped.", sender: 'shop', time: 'Yesterday 04:00 PM' },
      { id: 2, text: "Thanks for the update!", sender: 'customer', time: 'Yesterday 04:30 PM' },
    ]
  },
  {
    id: 4,
    name: 'Emma Davis',
    initials: 'ED',
    color: 'bg-purple-500',
    type: 'WhatsApp',
    lastMessage: "Can I return my order?",
    time: 'Tuesday',
    unread: 1,
    messages: [
      { id: 1, text: "Can I return my order?", sender: 'customer', time: 'Tuesday 11:00 AM' },
    ]
  }
];

const ShopChatPage = () => {
  const [activeChatId, setActiveChatId] = useState(1);
  const [chats, setChats] = useState(mockChats);
  const [message, setMessage] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleSend = () => {
    if (!message.trim()) return;
    
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: [
            ...chat.messages, 
            { 
              id: Date.now(), 
              text: message, 
              sender: 'shop', 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
          ]
        };
      }
      return chat;
    }));
    setMessage('');
  };

  const handleChatClick = (id: number) => {
    setActiveChatId(id);
    // Mark as read
    setChats(prevChats => prevChats.map(chat => chat.id === id ? { ...chat, unread: 0 } : chat));
  };

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[600px] w-full bg-gray-50 overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex flex-col gap-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            <MoreVertical className="text-gray-500 cursor-pointer hover:text-gray-700" size={20} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search or start new chat" 
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => handleChatClick(chat.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer flex items-center gap-3 transition-colors ${activeChatId === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-12 h-12 ${chat.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {chat.initials}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                  <span className={`text-xs ${chat.unread > 0 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-sm truncate ${chat.unread > 0 ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-[#e5ddd5]">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 ${activeChat.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
              {activeChat.initials}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{activeChat.name} <span className="text-xs font-normal text-gray-500">({activeChat.type})</span></h2>
              <p className="text-xs text-green-500 font-medium">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <Phone size={20} className="cursor-pointer hover:text-gray-800 transition-colors" />
            <Search size={20} className="cursor-pointer hover:text-gray-800 transition-colors" />
            <MoreVertical size={20} className="cursor-pointer hover:text-gray-800 transition-colors" />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {activeChat.messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'shop' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-lg p-3 relative shadow-sm ${msg.sender === 'shop' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                  <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[10px] text-gray-500 mt-1 block text-right">{msg.time}</span>
                </div>
             </div>
           ))}
        </div>

        {/* Chat Input Area */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center gap-2">
          <input 
            type="text" 
            placeholder={`Type a ${activeChat.type} reply...`} 
            className="flex-1 py-2.5 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopChatPage;