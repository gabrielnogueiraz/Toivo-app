import { create } from 'zustand';
import { Flower, FlowerStats, FlowerFilters, UpdateFlowerData } from '../types/garden';
import GardenService from '../services/gardenService';

interface GardenState {
  // Estado
  flowers: Flower[];
  stats: FlowerStats | null;
  filters: FlowerFilters;
  isLoading: boolean;
  error: string | null;
  selectedFlower: Flower | null;
  
  // Actions
  setFlowers: (flowers: Flower[]) => void;
  setStats: (stats: FlowerStats) => void;
  setFilters: (filters: FlowerFilters) => void;
  setSelectedFlower: (flower: Flower | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API calls
  fetchFlowers: () => Promise<void>;
  fetchStats: () => Promise<void>;
  updateFlower: (flowerId: string, data: UpdateFlowerData) => Promise<void>;
  deleteFlower: (flowerId: string) => Promise<void>;
  
  // Real-time updates
  addFlower: (flower: Flower) => void;
  updateFlowerInStore: (flower: Flower) => void;
  removeFlower: (flowerId: string) => void;
  
  // Utility
  getFilteredFlowers: () => Flower[];
  clearFilters: () => void;
}

export const useGardenStore = create<GardenState>((set, get) => ({
  // Estado inicial
  flowers: [],
  stats: null,
  filters: {},
  isLoading: false,
  error: null,
  selectedFlower: null,

  // Setters básicos
  setFlowers: (flowers) => set({ flowers }),

  setStats: (stats) => set({ stats }),

  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),

  setSelectedFlower: (flower) => set({ selectedFlower: flower }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // API calls
  fetchFlowers: async () => {
    try {
      set({ isLoading: true, error: null });

      const { filters } = get();
      const flowers = await GardenService.getFlowers(filters);
      
      set({ flowers, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar flores',
        isLoading: false 
      });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await GardenService.getStats();
      set({ stats });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas' 
      });
    }
  },

  updateFlower: async (flowerId, data) => {
    try {
      const updatedFlower = await GardenService.updateFlower(flowerId, data);
      
      set((state) => {
        const flowers = state.flowers.map(f => 
          f.id === flowerId ? updatedFlower : f
        );
        
        const selectedFlower = state.selectedFlower?.id === flowerId 
          ? updatedFlower 
          : state.selectedFlower;
        
        return { flowers, selectedFlower };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar flor' 
      });
    }
  },

  deleteFlower: async (flowerId) => {
    try {
      await GardenService.deleteFlower(flowerId);
      
      set((state) => ({
        flowers: state.flowers.filter(f => f.id !== flowerId),
        selectedFlower: state.selectedFlower?.id === flowerId ? null : state.selectedFlower
      }));
      
      // Recarregar estatísticas após deletar
      get().fetchStats();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao deletar flor' 
      });
    }
  },

  // Atualizações em tempo real
  addFlower: (flower) => set((state) => ({ 
    flowers: [flower, ...state.flowers] 
  })),

  updateFlowerInStore: (flower) => set((state) => {
    const flowers = state.flowers.map(f => 
      f.id === flower.id ? flower : f
    );
    
    const selectedFlower = state.selectedFlower?.id === flower.id 
      ? flower 
      : state.selectedFlower;
    
    return { flowers, selectedFlower };
  }),

  removeFlower: (flowerId) => set((state) => ({
    flowers: state.flowers.filter(f => f.id !== flowerId),
    selectedFlower: state.selectedFlower?.id === flowerId ? null : state.selectedFlower
  })),

  // Utility functions
  getFilteredFlowers: () => {
    const { flowers, filters } = get();
    
    return flowers.filter(flower => {
      // Filtro por tipo
      if (filters.type && flower.type !== filters.type) {
        return false;
      }
      
      // Filtro por prioridade
      if (filters.priority && flower.priority !== filters.priority) {
        return false;
      }
      
      // Filtro por tags
      if (filters.tags?.length) {
        const hasAnyTag = filters.tags.some(tag => flower.tags.includes(tag));
        if (!hasAnyTag) return false;
      }
      
      // Filtro por mês
      if (filters.month) {
        const flowerMonth = new Date(flower.createdAt).toISOString().slice(0, 7); // YYYY-MM
        if (flowerMonth !== filters.month) return false;
      }
      
      // Filtro por busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = flower.name.toLowerCase().includes(searchLower);
        const tagMatch = flower.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!nameMatch && !tagMatch) return false;
      }
      
      return true;
    });
  },

  clearFilters: () => set({ filters: {} }),
}));
