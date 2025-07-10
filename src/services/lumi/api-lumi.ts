import { 
  LumiAskRequest, 
  LumiAskResponse, 
  LumiCreateMemoryRequest, 
  LumiGetMemoriesRequest, 
  LumiMemory,
  LumiContextResponse,
  LumiStreamChunk
} from '@/types/lumi';
import { getAuthToken, clearAuthData } from '@/services/api';

const LUMI_BASE_URL = import.meta.env.VITE_LUMI_API_URL || 'http://localhost:3001';

/**
 * Cliente para interagir com a API da Lumi usando autenticação JWT do Toivo
 */
export class LumiAPIClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || LUMI_BASE_URL;
  }

  /**
   * Gera headers com autenticação JWT do Toivo
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Trata respostas de erro de autenticação
   */
  private handleAuthError(response: Response): void {
    if (response.status === 401) {
      console.warn('Token JWT expirado ou inválido - redirecionando para login');
      clearAuthData();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  /**
   * Executa uma requisição HTTP para a API da Lumi
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Token JWT não encontrado.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    // Verificar erros de autenticação
    this.handleAuthError(response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  /**
   * Faz uma pergunta para a Lumi e retorna a resposta completa
   */
  async ask(message: string, context?: any): Promise<LumiAskResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    return this.request<LumiAskResponse>('/api/ask-json', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
      }),
    });
  }

  /**
   * Faz uma pergunta para a Lumi com streaming de resposta
   */
  async askStream(
    message: string, 
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch(`${this.baseUrl}/api/ask`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message,
        }),
      });

      // Verificar erros de autenticação
      this.handleAuthError(response);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Stream não disponível');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete?.();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }

  /**
   * Cria uma nova memória
   */
  async createMemory(memory: Omit<LumiCreateMemoryRequest, 'userId'>): Promise<LumiMemory> {
    return this.request<LumiMemory>('/api/memories', {
      method: 'POST',
      body: JSON.stringify(memory),
    });
  }

  /**
   * Busca memórias do usuário
   */
  async getMemories(filters?: LumiGetMemoriesRequest): Promise<{ data: LumiMemory[] }> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

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

  /**
   * Verifica a saúde da API
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  /**
   * Valida se o token JWT ainda é válido
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/auth/validate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const result = await response.json();
      return result.valid === true;
    } catch {
      return false;
    }
  }
}

/**
 * Factory function para criar uma instância do cliente Lumi
 */
export const createLumiClient = (): LumiAPIClient => {
  return new LumiAPIClient();
};
