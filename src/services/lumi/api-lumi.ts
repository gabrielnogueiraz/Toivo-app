import { 
  LumiAskRequest, 
  LumiAskResponse, 
  LumiCreateMemoryRequest, 
  LumiGetMemoriesRequest, 
  LumiMemory,
  LumiContextResponse,
  LumiStreamChunk
} from '@/types/lumi';
import { getAuthToken, getLumiToken, clearAuthData, isLumiTokenExpiring, getUserData } from '@/services/api';

const LUMI_BASE_URL = import.meta.env.VITE_LUMI_API_URL || 'http://localhost:3001';

/**
 * Cliente para interagir com a API da Lumi usando autenticação JWT convertida
 */
export class LumiAPIClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || LUMI_BASE_URL;
  }

  /**
   * Obtém o userId do usuário autenticado
   */
  private getUserId(): string {
    const userData = getUserData();
    if (!userData || !userData.id) {
      throw new Error('Usuário não autenticado ou ID não disponível');
    }
    return userData.id;
  }

  /**
   * Gera headers com token Lumi (assíncrono agora!)
   */
  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    try {
      // Obter token específico da Lumi
      const lumiToken = await getLumiToken();
      
      if (lumiToken) {
        headers['Authorization'] = `Bearer ${lumiToken}`;
        console.log('🔑 Usando token Lumi para requisição');
      } else {
        console.warn('⚠️ Token Lumi não disponível');
      }
    } catch (error) {
      console.error('❌ Erro ao obter token Lumi:', error);
      
      // Fallback: tentar token original do Toivo (pode não funcionar)
      const toivoToken = getAuthToken();
      if (toivoToken) {
        headers['Authorization'] = `Bearer ${toivoToken}`;
        console.warn('⚠️ Usando token Toivo como fallback');
      }
    }

    // Log headers para debug CORS
    if (import.meta.env.DEV) {
      console.log('📋 Headers sendo enviados:', headers);
    }

    return headers;
  }

  /**
   * Trata respostas de erro de autenticação com retry automático
   */
  private async handleAuthError(response: Response): Promise<void> {
    if (response.status === 401) {
      console.warn('🔑 Token rejeitado pela Lumi - tentando renovar...');
      
      try {
        // Força renovação do token Lumi
        const newToken = await getLumiToken();
        
        if (newToken) {
          console.log('✅ Token Lumi renovado com sucesso');
        } else {
          console.error('❌ Falha na renovação - redirecionando para login');
          clearAuthData();
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('❌ Erro na renovação automática:', error);
        clearAuthData();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
  }

  /**
   * Executa uma requisição HTTP para a API da Lumi com retry automático de autenticação
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Token JWT não encontrado.');
    }

    // Obter headers com token já tratado corretamente
    const headers = await this.getHeaders();
    
    const url = `${this.baseUrl}${endpoint}`;
    
    // Log detalhado para debug (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      console.log('🚀 Requisição para Lumi:', {
        url,
        method: options.method || 'GET',
        authHeader: headers['Authorization'],
        endpoint
      });
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        // Adicionar configurações CORS explícitas
        mode: 'cors',
        credentials: 'omit',
      });

      // Verificar erros de autenticação com retry automático
      await this.handleAuthError(response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      // Se for erro de rede (API não disponível), não fazer logout
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('API da Lumi indisponível. Verifique se está rodando em localhost:3001');
      }
      throw error;
    }
  }

  /**
   * Faz uma pergunta para a Lumi e retorna a resposta completa
   */
  async ask(message: string, context?: any): Promise<LumiAskResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const userId = this.getUserId();

    return this.request<LumiAskResponse>('/api/ask-json', {
      method: 'POST',
      body: JSON.stringify({
        message,
        userId,
        context,
      }),
    });
  }

  /**
   * Faz uma pergunta para a Lumi com streaming de resposta
   * WORKAROUND: Usa o endpoint ask-json e simula streaming para evitar problemas de CORS
   */
  async askStream(
    message: string, 
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      console.log('🎯 Usando workaround: ask-json com simulação de streaming');
      
      // Usar o endpoint que funciona (/api/ask-json) em vez do problemático (/api/ask)
      const response = await this.ask(message);
      
      if (response.success && response.data?.message) {
        // Simular streaming dividindo a resposta por palavras para efeito mais natural
        const fullMessage = response.data.message;
        const words = fullMessage.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
          onChunk(chunk);
          
          // Delay variável baseado no tamanho da palavra para simular streaming real
          const delay = Math.min(50 + words[i].length * 10, 200);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        onComplete?.();
      } else {
        throw new Error(response.error || 'Resposta inválida da API');
      }
    } catch (error) {
      console.error('❌ Erro no askStream (workaround):', error);
      onError?.(error as Error);
    }
  }

  /**
   * Cria uma nova memória
   */
  async createMemory(memory: Omit<LumiCreateMemoryRequest, 'userId'>): Promise<LumiMemory> {
    const userId = this.getUserId();
    
    return this.request<LumiMemory>('/api/memories', {
      method: 'POST',
      body: JSON.stringify({
        ...memory,
        userId,
      }),
    });
  }

  /**
   * Busca memórias do usuário
   */
  async getMemories(filters?: LumiGetMemoriesRequest): Promise<{ data: LumiMemory[] }> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.limit && typeof filters.limit === 'number') {
      params.append('limit', filters.limit.toString());
    }
    if (filters?.offset && typeof filters.offset === 'number') {
      params.append('offset', filters.offset.toString());
    }

    const queryString = params.toString();
    const endpoint = `/api/memories${queryString ? '?' + queryString : ''}`;
    
    return this.request<{ data: LumiMemory[] }>(endpoint);
  }

  /**
   * Busca insights de produtividade
   */
  async getProductivityInsights(): Promise<{ data: LumiMemory[] }> {
    return this.request<{ data: LumiMemory[] }>('/api/memories/productivity-insights');
  }

  /**
   * Busca o contexto atual do usuário
   */
  async getContext(): Promise<LumiContextResponse> {
    return this.request<LumiContextResponse>('/api/context');
  }

}

/**
 * Factory function para criar uma instância do cliente Lumi
 */
export const createLumiClient = (): LumiAPIClient => {
  return new LumiAPIClient();
};
