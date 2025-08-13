import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      userInfo: {
        nickname: '小甜心',
        status: '🌸 今天也要元气满满哦~',
        avatar: 'https://placekitten.com/100/100'
      },
      
      setUserInfo: (newInfo) => {
        set((state) => ({ userInfo: { ...state.userInfo, ...newInfo } }));
      },
      clearUserInfo: () => set({ userInfo: null })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ userInfo: state.userInfo }),
    }
  )
);

export default useUserStore;