import { create } from 'zustand';

interface Celebration {
  id: string;
  type: 'legendary_flower' | 'task_completion' | 'streak_milestone';
  flowerName?: string;
  flowerCount?: number;
  isVisible: boolean;
}

interface CelebrationStore {
  activeCelebration: Celebration | null;
  celebrationQueue: Celebration[];
  
  // Actions
  triggerLegendaryFlowerCelebration: (flowerName: string, count?: number) => void;
  triggerTaskCompletionCelebration: () => void;
  dismissCelebration: () => void;
  processNextCelebration: () => void;
}

export const useCelebrationStore = create<CelebrationStore>((set, get) => ({
  activeCelebration: null,
  celebrationQueue: [],

  triggerLegendaryFlowerCelebration: (flowerName: string, count = 1) => {
    const celebration: Celebration = {
      id: `legendary_${Date.now()}`,
      type: 'legendary_flower',
      flowerName,
      flowerCount: count,
      isVisible: true
    };

    const { activeCelebration, celebrationQueue } = get();
    
    if (activeCelebration) {
      // Se já há uma celebração ativa, adicionar à fila
      set({ celebrationQueue: [...celebrationQueue, celebration] });
    } else {
      // Mostrar imediatamente
      set({ activeCelebration: celebration });
    }
  },

  triggerTaskCompletionCelebration: () => {
    const celebration: Celebration = {
      id: `task_${Date.now()}`,
      type: 'task_completion',
      isVisible: true
    };

    const { activeCelebration, celebrationQueue } = get();
    
    if (activeCelebration) {
      set({ celebrationQueue: [...celebrationQueue, celebration] });
    } else {
      set({ activeCelebration: celebration });
    }
  },

  dismissCelebration: () => {
    set({ activeCelebration: null });
    
    // Processar próxima celebração da fila
    setTimeout(() => {
      get().processNextCelebration();
    }, 500);
  },

  processNextCelebration: () => {
    const { celebrationQueue } = get();
    
    if (celebrationQueue.length > 0) {
      const [nextCelebration, ...remainingQueue] = celebrationQueue;
      set({
        activeCelebration: nextCelebration,
        celebrationQueue: remainingQueue
      });
    }
  }
}));
