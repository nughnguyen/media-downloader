import { create } from 'zustand';

export interface QueueItem {
  id: string;
  url: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  thumbnail?: string;
  error?: string;
  addedAt: Date;
  source?: 'external' | 'internal';
}

interface QueueStore {
  items: QueueItem[];
  isVisible: boolean;
  
  // Actions
  addItem: (url: string) => void;
  updateItem: (id: string, updates: Partial<QueueItem>) => void;
  removeItem: (id: string) => void;
  clearCompleted: () => void;
  toggleVisibility: () => void;
  setVisibility: (visible: boolean) => void;
}

export const useQueueStore = create<QueueStore>((set) => ({
  items: [],
  isVisible: false,

  addItem: (url) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          id: Math.random().toString(36).substring(7),
          url,
          title: 'Processing...',
          status: 'pending',
          progress: 0,
          addedAt: new Date(),
        },
      ],
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearCompleted: () =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.status !== 'completed' && item.status !== 'failed'
      ),
    })),

  toggleVisibility: () =>
    set((state) => ({
      isVisible: !state.isVisible,
    })),

  setVisibility: (visible) =>
    set({
      isVisible: visible,
    }),
}));
