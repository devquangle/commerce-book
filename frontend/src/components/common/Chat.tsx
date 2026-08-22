import React from 'react';
import { useChat } from '@/modules/others/twilio/context/ChatContext';
import { MessageSquare } from 'lucide-react';

interface ChatProps {
  shopId: string | number;
  shopName?: string;
  onChatClick?: (shopId: string | number) => void;
}

export const Chat = ({ shopId, shopName, onChatClick }: ChatProps) => {
  const { openChatWithShop, isOpen } = useChat();

  // Hide the floating button if the chat widget is already open
  if (isOpen) return null;

  return (
    <button
      onClick={() => {
        openChatWithShop(shopId, shopName);
        onChatClick?.(shopId);
      }}
      className="fixed bottom-20 right-6 z-40 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
      aria-label="Chat with shop"
    >
      <MessageSquare className="w-5 h-5" />
    </button>
  );
};
