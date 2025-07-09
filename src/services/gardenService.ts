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
}

export default GardenService;
