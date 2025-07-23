import apiClient from './api';
import { Flower, FlowerStats, UpdateFlowerData, FlowerFilters } from '../types/garden';

export class GardenService {
  /**
   * Obter todas as flores do usuário
   */
  static async getFlowers(filters?: FlowerFilters): Promise<Flower[]> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.month) params.append('month', filters.month);
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get(`/garden?${params.toString()}`);
    return response.data.data;
  }

  /**
   * Obter estatísticas do jardim
   */
  static async getStats(): Promise<FlowerStats> {
    const response = await apiClient.get('/garden/stats');
    return response.data.data;
  }

  /**
   * Obter uma flor específica
   */
  static async getFlower(flowerId: string): Promise<Flower> {
    const response = await apiClient.get(`/garden/${flowerId}`);
    return response.data.data;
  }

  /**
   * Atualizar uma flor (nome, tags)
   */
  static async updateFlower(flowerId: string, data: UpdateFlowerData): Promise<Flower> {
    const response = await apiClient.patch(`/garden/${flowerId}`, data);
    return response.data.data;
  }

  /**
   * Deletar uma flor
   */
  static async deleteFlower(flowerId: string): Promise<void> {
    await apiClient.delete(`/garden/${flowerId}`);
  }

  /**
   * Obter todas as tags únicas do jardim
   */
  static async getAllTags(): Promise<string[]> {
    const flowers = await this.getFlowers();
    const tagsSet = new Set<string>();
    
    flowers.forEach(flower => {
      flower.tags.forEach(tag => tagsSet.add(tag));
    });
    
    return Array.from(tagsSet).sort();
  }

  /**
   * Debug: Verificar conexão e dados do jardim
   */
  static async debugGarden(): Promise<{
    hasConnection: boolean;
    flowersCount: number;
    statsAvailable: boolean;
    lastError?: string;
  }> {
    try {
      console.log('Debugando jardim...');
      
      // Testar conexão básica
      const flowers = await this.getFlowers();
      console.log('Flores encontradas:', flowers);
      
      // Testar estatísticas
      const stats = await this.getStats();
      console.log('Stats do jardim:', stats);
      
      return {
        hasConnection: true,
        flowersCount: flowers.length,
        statsAvailable: !!stats
      };
    } catch (error) {
      console.error('Erro no debug do jardim:', error);
      return {
        hasConnection: false,
        flowersCount: 0,
        statsAvailable: false,
        lastError: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Criar uma flor de teste (para debug)
   */
  static async createTestFlower(): Promise<Flower | null> {
    try {
      // Tentar criar via API (se existir endpoint)
      const response = await apiClient.post('/garden', {
        name: 'Flor de Teste',
        priority: 'MEDIUM',
        type: 'normal',
        tags: ['teste', 'debug']
      });
      
      console.log('Flor de teste criada:', response.data);
      return response.data.data;
    } catch (error) {
      console.warn('Não foi possível criar flor de teste via API:', error);
      
      // Tentar método alternativo via simulação de tarefa completada
      try {
        const testTaskResponse = await apiClient.post('/garden/test-flower', {
          taskName: 'Tarefa de Teste',
          priority: 'MEDIUM',
          pomodorosCompleted: 4,
          pomodorosRequired: 4
        });
        
        console.log('Flor de teste criada via método alternativo:', testTaskResponse.data);
        return testTaskResponse.data.data;
      } catch (altError) {
        console.warn('Método alternativo também falhou:', altError);
        return null;
      }
    }
  }

  /**
   * Simular criação de flor via conclusão de tarefa
   */
  static async simulateTaskCompletion(taskData: {
    taskName: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    pomodorosCompleted: number;
    pomodorosRequired: number;
  }): Promise<Flower | null> {
    try {
      const response = await apiClient.post('/tasks/simulate-completion', taskData);
      console.log('Simulação de tarefa completada:', response.data);
      return response.data.flower || null;
    } catch (error) {
      console.warn('Não foi possível simular conclusão de tarefa:', error);
      return null;
    }
  }
}

export default GardenService;
