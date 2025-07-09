export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type FlowerType = 'normal' | 'legendary';

export interface Flower {
  id: string;
  name: string;
  type: FlowerType;
  priority: Priority;
  color: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  taskId: string;
  isCustomName: boolean;
}

export interface FlowerStats {
  totalFlowers: number;
  normalFlowers: number;
  legendaryFlowers: number;
  flowersByPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
  flowersByMonth: Array<{
    month: string;
    count: number;
  }>;
  completionStreak: number;
  favoriteFlower?: Flower;
}

export interface CreateFlowerData {
  name?: string;
  priority: Priority;
  taskId: string;
}

export interface UpdateFlowerData {
  name?: string;
  tags?: string[];
}

export interface FlowerFilters {
  type?: FlowerType;
  priority?: Priority;
  tags?: string[];
  month?: string;
  search?: string;
}

// Eventos WebSocket
export interface FlowerEvent {
  type: 'flower:created' | 'flower:updated' | 'flower:deleted';
  data: Flower;
}

// Cores das flores baseadas na prioridade
export const FLOWER_COLORS = {
  LOW: '#A3BE8C',     // Verde calmo
  MEDIUM: '#EBCB8B',  // Amarelo quente
  HIGH: '#BF616A',    // Vermelho intenso
} as const;

// Nomes das flores lendárias
export const LEGENDARY_FLOWER_NAMES = {
  5: 'Flor da Coragem',
  10: 'Flor Rubra do Foco Total',
  25: 'Rosa da Constância',
} as const;
