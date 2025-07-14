import { LumiMessage } from '@/types/lumi';
import { getAuthToken } from '@/services/api';

/**
 * Mock do serviço da Lumi para desenvolvimento
 * Agora usa o sistema de autenticação do Toivo
 */
export class MockLumiService {
  private mockResponses: string[] = [
    'Olá! Como posso ajudar você hoje?',
    'Entendo sua necessidade. Vou analisar isso para você.',
    'Baseado no que você me disse, aqui estão algumas sugestões...',
    'Essa é uma pergunta interessante! Deixe-me pensar...',
    'Vou pesquisar mais informações sobre isso.',
    'Aqui está o que encontrei sobre o assunto...',
    'Posso ajudar você com isso! Vamos começar...',
    'Excelente pergunta! Vou explicar passo a passo...',
  ];

  constructor() {
    // Não precisa mais do userId - usa o token JWT automaticamente
  }

  /**
   * Verifica se o usuário está autenticado
   */
  private isAuthenticated(): boolean {
    return !!getAuthToken();
  }

  async sendMessage(message: string): Promise<LumiMessage> {
    if (!this.isAuthenticated()) {
      return {
        id: this.generateMessageId(),
        content: 'Você precisa estar logado no Toivo para conversar com a Lumi.',
        isFromUser: false,
        timestamp: new Date(),
        error: 'Usuário não autenticado',
      };
    }

    // Simular delay de resposta
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const randomResponse = this.mockResponses[Math.floor(Math.random() * this.mockResponses.length)];
    
    return {
      id: this.generateMessageId(),
      content: this.generateContextualResponse(message, randomResponse),
      isFromUser: false,
      timestamp: new Date(),
      isStreaming: false,
    };
  }

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

    try {
      const response = this.generateContextualResponse(message, 
        this.mockResponses[Math.floor(Math.random() * this.mockResponses.length)]
      );
      
      const words = response.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
        
        if (i === 0) {
          onChunk(words[i]);
        } else {
          onChunk(' ' + words[i]);
        }
      }
      
      onComplete?.();
    } catch (error) {
      onError?.(error as Error);
    }
  }

  async createMemoryFromConversation(): Promise<any> {
    if (!this.isAuthenticated()) {
      return null;
    }
    // Mock - não fazer nada
    return null;
  }

  async getUserMemories(): Promise<any[]> {
    if (!this.isAuthenticated()) {
      return [];
    }
    return [];
  }

  async getProductivityInsights(): Promise<any[]> {
    if (!this.isAuthenticated()) {
      return [];
    }
    return [];
  }

  async getUserContext(): Promise<any> {
    if (!this.isAuthenticated()) {
      return null;
    }
    return null;
  }

  async validateToken(): Promise<boolean> {
    return this.isAuthenticated();
  }

  getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  createBasicContext(): any {
    return {
      timeOfDay: this.getCurrentTimeOfDay(),
      currentDate: new Date().toISOString(),
    };
  }

  private generateMessageId(): string {
    return `mock_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateContextualResponse(userMessage: string, baseResponse: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('produtiv')) {
      return `Sobre produtividade: ${baseResponse} Algumas dicas que posso dar são: organize suas tarefas por prioridade, use a técnica Pomodoro, e mantenha um ambiente de trabalho limpo.`;
    }
    
    if (lowerMessage.includes('tarefa') || lowerMessage.includes('task')) {
      return `Sobre tarefas: ${baseResponse} Posso ajudar você a organizar suas tarefas e definir prioridades. Que tipo de tarefa você precisa gerenciar?`;
    }
    
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      return `${baseResponse} Posso ajudar você com: organização de tarefas, técnicas de produtividade, análise de progresso e muito mais. O que você gostaria de saber?`;
    }
    
    if (lowerMessage.includes('progresso') || lowerMessage.includes('progress')) {
      return `Sobre seu progresso: ${baseResponse} Para analisar seu progresso, preciso de mais informações sobre suas metas e atividades atuais.`;
    }
    
    return baseResponse;
  }
}

/**
 * Verifica se deve usar o serviço mock (DESABILITADO para testes reais)
 */
export const shouldUseMockService = (): boolean => {
  // SEMPRE retorna false para forçar uso da API real
  return false;
};

/**
 * Factory para criar serviço da Lumi (SEMPRE usa serviço real)
 * Mock desabilitado para testes com a Lumi real
 */
export const createLumiServiceWithFallback = () => {
  // SEMPRE usa o serviço real da Lumi
  const { createLumiService } = require('@/services/lumi');
  return createLumiService();
};
