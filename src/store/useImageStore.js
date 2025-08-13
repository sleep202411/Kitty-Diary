import { create } from 'zustand';
import { getImages} from '../api/image';

export const useImageStore = create((set, get) => ({
  images: [],
  page: 1,
  loading: false,
  hasMore: true,
  
  fetchMore: async () => {
    if (get().loading || !get().hasMore) return;
    
    set({ loading: true });
    try {
      const newImages = await getImages(get().page);
      set((state) => ({
        images: [...state.images, ...newImages],
        page: state.page + 1,
        hasMore: newImages.length > 0,
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
    }
  },
  
  
  initialize: async () => {
    set({ images: [], page: 1, loading: false, hasMore: true });
    await get().fetchMore();
  }
}));