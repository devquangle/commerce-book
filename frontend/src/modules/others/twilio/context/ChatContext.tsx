import React, { createContext, useContext, useState } from 'react';
import { twilioService } from '../services/twilio.service';
import type { Client, Conversation } from '@twilio/conversations';

interface ChatContextType {
  client: Client | null;
  activeConversation: Conversation | null;
  isOpen: boolean;
  openChatWithShop: (shopId: string | number, shopName?: string) => void;
  closeChat: () => void;
  initializeChat: (token: string) => Promise<void>;
  shopName: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shopName, setShopName] = useState<string | null>(null);

  const initializeChat = async (token: string) => {
    try {
      const initClient = await twilioService.initializeClient(token);
      setClient(initClient);
    } catch (error) {
      console.error('Failed to initialize Twilio Chat', error);
    }
  };

  const openChatWithShop = async (shopId: string | number, name?: string) => {
    // TODO: Call backend to get conversation SID for this shopId
    // For now, just open the UI
    console.log('Opening chat for shop', shopId, name);
    setIsOpen(true);
    setShopName(name || null);
  };

  const closeChat = () => {
    setIsOpen(false);
    setActiveConversation(null);
    setShopName(null);
  };

  return (
    <ChatContext.Provider value={{ client, activeConversation, isOpen, openChatWithShop, closeChat, initializeChat, shopName }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
