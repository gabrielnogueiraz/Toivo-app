import apiClient from './api';
import {
  UserPlanInfo,
  CreditInfo,
  CheckoutSession,
  MessageLimitCheck,
  CreateCheckoutSessionRequest,
  BuyCreditPackRequest,
  SubscriptionApiResponse,
  CreditPackType
} from '@/types/subscription';

class SubscriptionService {
  /**
   * Obtém informações do plano atual do usuário
   */
  async getUserPlan(): Promise<UserPlanInfo> {
    try {
      const response = await apiClient.get<SubscriptionApiResponse<UserPlanInfo>>(
        '/subscription/me/plan'
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Erro ao obter informações do plano');
    } catch (error: any) {
      console.error('Erro ao obter plano do usuário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao obter informações do plano');
    }
  }

  /**
   * Obtém informações de créditos do usuário
   */
  async getUserCredits(): Promise<CreditInfo> {
    try {
      const response = await apiClient.get<SubscriptionApiResponse<CreditInfo>>(
        '/subscription/me/credits'
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Erro ao obter informações de créditos');
    } catch (error: any) {
      console.error('Erro ao obter créditos do usuário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao obter informações de créditos');
    }
  }

  /**
   * Cria uma sessão de checkout no Stripe para upgrade de plano
   */
  async createCheckoutSession(request: CreateCheckoutSessionRequest): Promise<CheckoutSession> {
    try {
      const defaultUrls = {
        successUrl: `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/pricing?payment=cancelled`
      };

      const requestBody = {
        ...request,
        successUrl: request.successUrl || defaultUrls.successUrl,
        cancelUrl: request.cancelUrl || defaultUrls.cancelUrl
      };

      const response = await apiClient.post<SubscriptionApiResponse<CheckoutSession>>(
        '/subscription/checkout/session',
        requestBody
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Erro ao criar sessão de checkout');
    } catch (error: any) {
      console.error('Erro ao criar checkout session:', error);
      throw new Error(error.response?.data?.message || 'Erro ao criar sessão de checkout');
    }
  }

  /**
   * Compra um pacote de créditos
   */
  async buyCreditPack(request: BuyCreditPackRequest): Promise<CheckoutSession> {
    try {
      const response = await apiClient.post<SubscriptionApiResponse<CheckoutSession>>(
        '/subscription/credits/buy',
        request
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Erro ao comprar créditos');
    } catch (error: any) {
      console.error('Erro ao comprar pacote de créditos:', error);
      throw new Error(error.response?.data?.message || 'Erro ao comprar créditos');
    }
  }

  /**
   * Verifica se o usuário pode enviar uma mensagem
   */
  async checkMessageLimit(): Promise<MessageLimitCheck> {
    try {
      const response = await apiClient.get<SubscriptionApiResponse<MessageLimitCheck>>(
        '/subscription/message/check-limit'
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Erro ao verificar limite de mensagem');
    } catch (error: any) {
      console.error('Erro ao verificar limite de mensagem:', error);
      throw new Error(error.response?.data?.message || 'Erro ao verificar limite de mensagem');
    }
  }

  /**
   * Registra o envio de uma mensagem
   */
  async recordMessage(): Promise<void> {
    try {
      const response = await apiClient.post<SubscriptionApiResponse<void>>(
        '/subscription/message/record'
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao registrar mensagem');
      }
    } catch (error: any) {
      console.error('Erro ao registrar mensagem:', error);
      
      // Se for erro de limite excedido, lançar erro específico
      if (error.response?.data?.error === 'MESSAGE_LIMIT_EXCEEDED') {
        throw new Error(error.response.data.message || 'Limite de mensagens excedido');
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao registrar mensagem');
    }
  }

  /**
   * Cria URL de checkout direto para um plano específico
   */
  async createPlanCheckout(priceId: string): Promise<string> {
    try {
      const session = await this.createCheckoutSession({ priceId });
      return session.url;
    } catch (error) {
      console.error('Erro ao criar checkout do plano:', error);
      throw error;
    }
  }

  /**
   * Cria URL de checkout para pacote de créditos
   */
  async createCreditCheckout(pack: CreditPackType): Promise<string> {
    try {
      const session = await this.buyCreditPack({ pack });
      return session.url;
    } catch (error) {
      console.error('Erro ao criar checkout de créditos:', error);
      throw error;
    }
  }

  /**
   * Calcula o percentual de uso das mensagens diárias
   */
  calculateUsagePercentage(used: number, limit: number): number {
    if (limit === Infinity || limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  }

  /**
   * Verifica se o usuário está próximo do limite (>= 80%)
   */
  isNearLimit(used: number, limit: number): boolean {
    return this.calculateUsagePercentage(used, limit) >= 80;
  }

  /**
   * Verifica se o usuário excedeu o limite
   */
  hasExceededLimit(used: number, limit: number): boolean {
    if (limit === Infinity) return false;
    return used >= limit;
  }

  /**
   * Retorna mensagem de status baseada no uso
   */
  getUsageStatus(used: number, limit: number, extraCredits: number = 0): {
    status: 'good' | 'warning' | 'danger';
    message: string;
  } {
    if (limit === Infinity) {
      return {
        status: 'good',
        message: 'Mensagens ilimitadas'
      };
    }

    const remaining = Math.max(0, limit - used);
    const percentage = this.calculateUsagePercentage(used, limit);

    if (used >= limit) {
      if (extraCredits > 0) {
        return {
          status: 'warning',
          message: `Limite diário atingido. ${extraCredits} crédito${extraCredits !== 1 ? 's' : ''} disponível${extraCredits !== 1 ? 'eis' : ''}`
        };
      }
      return {
        status: 'danger',
        message: 'Limite diário esgotado'
      };
    }

    if (percentage >= 80) {
      return {
        status: 'warning',
        message: `${remaining} mensagem${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}`
      };
    }

    return {
      status: 'good',
      message: `${remaining} de ${limit} mensagens usadas`
    };
  }
}

// Instância singleton do serviço
export const subscriptionService = new SubscriptionService();
export default subscriptionService; 