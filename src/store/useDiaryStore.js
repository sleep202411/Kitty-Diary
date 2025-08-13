import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDiaryStore = create(
  persist(
    (set, get) => ({
      diaries: [],
      
      // 添加新日记
      addDiary: (diary) => {
        set((state) => ({
          diaries: [{
            ...diary,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, ...state.diaries]
        }));
      },
      
      // 删除日记
      deleteDiary: (id) => {
        set((state) => ({
          diaries: state.diaries.filter(diary => diary.id !== id)
        }));
      },
      
      // 更新日记
      updateDiary: (id, updatedData) => {
        set((state) => ({
          diaries: state.diaries.map(diary => 
            diary.id === id ? { 
              ...diary, 
              ...updatedData,
              updatedAt: new Date().toISOString()
            } : diary
          )
        }));
      },
      
      // 获取单篇日记
      getDiary: (id) => {
        return get().diaries.find(diary => diary.id === id);
      },
      
      // 清空所有日记
      clearAllDiaries: () => {
        set({ diaries: [] });
      }
    }),
    {
      name: 'diary-storage',
      partialize: (state) => ({ diaries: state.diaries }),
      // 可选：添加版本控制
      version: 1,
      // 可选：添加迁移逻辑
      migrate: (persistedState, version) => {
        if (version === 0) {
          // 从版本0迁移到版本1的逻辑
          return { ...persistedState, version: 1 };
        }
        return persistedState;
      }
    }
  )
);

export default useDiaryStore;