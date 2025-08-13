import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import kittyAvatar from '@/assets/kitty-avatar.png';

const useChatStore = create(
  persist(
    (set) => ({
      messages: [
        {
          id: 0,
          content: '欢迎来找 Kitty 聊天哦，今天心情怎么样呀？',
          isBot: true,
          avatar: kittyAvatar
        }
      ],
      
      addMessage: (message) => {
        set((state) => ({ messages: [...state.messages, message] }));
      },
      
      clearMessages: () => {
        set({ messages: [] });
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ messages: state.messages }),
      version: 1
    }
  )
);

export default useChatStore;