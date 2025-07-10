import { createLumiClient, LumiAPIClient } from './api-lumi';
import { getAuthToken } from '@/services/api';
import {
  LumiMessage,
  LumiMemory,
  LumiContext,
  LumiContextResponse
} from '@/types/lumi';

/**
 * Serviço principal da Lumi que gerencia todas as interações
 * Agora usa automaticamente o token JWT do Toivo para autenticação
 */
export class LumiService {
  private client: LumiAPIClient;

  constructor() {
    this.client = createLumiClient();
  }

  /**
   * Verifica se o usuário está autenticado
   */
  private isAuthenticated(): boolean {
    return !!getAuthToken();
  }

  /**
   * Envia uma mensagem para a Lumi e retorna a resposta
   */
  async sendMessage(message: string, context?: LumiContext): Promise<LumiMessage> {
    if (!this.isAuthenticated()) {
      return {
        id: this.generateMessageId(),
        content: 'Você precisa estar logado no Toivo para conversar com a Lumi.',
        isFromUser: false,
        timestamp: new Date(),
        error: 'Usuário não autenticado',
      };
    }

    try {
      const response = await this.client.ask(message, context);
      
      return {
        id: this.generateMessageId(),
        content: response.data.message,
        isFromUser: false,
        timestamp: new Date(),
        isStreaming: false,
      };
    } catch (error) {
      return {
        id: this.generateMessageId(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        isFromUser: false,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Envia uma mensagem para a Lumi com streaming
   */
  async sendMessageStream(
    message: string,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    if (!this.isAuthenticated()) {
      onError?.(new Error('Usuário não autenticado'));
      return;
    }

    return this.client.askStream(message, onChunk, onComplete, onError);
  }

  /**
   * Cria uma memória baseada em uma conversa
   */
  async createMemoryFromConversation(
    userMessage: string,
    lumiResponse: string,
    importance: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM'
  ): Promise<LumiMemory | null> {
    if (!this.isAuthenticated()) {
      console.warn('Usuário não autenticado - não é possível criar memória');
      return null;
    }

    try {
      const content = `Conversa: Usuario: "${userMessage}" | Lumi: "${lumiResponse}"`;
      
      return await this.client.createMemory({
        type: 'PERSONAL_CONTEXT',
        content,
        importance,
        tags: ['conversa', 'interacao'],
      });
    } catch (error) {
      console.error('Erro ao criar memória:', error);
      return null;
    }
  }

  /**
   * Busca memórias do usuário
   */
  async getUserMemories(type?: LumiMemory['type'], limit = 10): Promise<LumiMemory[]> {
    if (!this.isAuthenticated()) {
      console.warn('Usuário não autenticado - não é possível buscar memórias');
      return [];
    }

    try {
      const response = await this.client.getMemories({ type, limit });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar memórias:', error);
      return [];
    }
  }

  /**
   * Busca insights de produtividade
   */
  async getProductivityInsights(): Promise<LumiMemory[]> {
    if (!this.isAuthenticated()) {
      console.warn('Usuário não autenticado - não é possível buscar insights');
      return [];
    }

    try {
      const response = await this.client.getProductivityInsights();
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar insights:', error);
      return [];
    }
  }

  /**
   * Busca o contexto atual do usuário
   */
  async getUserContext(): Promise<LumiContextResponse | null> {
    if (!this.isAuthenticated()) {
      console.warn('Usuário não autenticado - não é possível buscar contexto');
      return null;
    }

    try {
      return await this.client.getContext();
    } catch (error) {
      console.error('Erro ao buscar contexto:', error);
      return null;
    }
  }

  /**
   * Verifica se a API está funcionando
   */
  async checkHealth(): Promise<boolean> {
    try {
      await this.client.healthCheck();
      return true;
    } catch (error) {
      console.error('API da Lumi indisponível:', error);
      return false;
    }
  }

  /**
   * Valida se o token JWT ainda é válido
   */
  async validateToken(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      return await this.client.validateToken();
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  /**
   * Gera um ID único para mensagens
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Determina o horário do dia atual
   */
  getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Cria contexto básico para conversas
   */
  createBasicContext(mood?: string): LumiContext {
    return {
      timeOfDay: this.getCurrentTimeOfDay(),
      currentDate: new Date().toISOString(),
      mood,
    };
  }
}

/**
 * Factory function para criar uma instância do serviço Lumi
 * Agora não precisa mais do userId - usa automaticamente o token JWT
 */
export const createLumiService = (): LumiService => {
  return new LumiService();
};
