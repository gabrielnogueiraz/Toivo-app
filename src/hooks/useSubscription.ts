import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import subscriptionService from '@/services/subscriptionService';
import {
  UserPlanInfo,
  CreditInfo,
  MessageLimitCheck,
  CreditPackType,
  Plan
} from '@/types/subscription';

// Query keys para cache
export const SUBSCRIPTION_QUERY_KEYS = {
  userPlan: 'subscription-user-plan',
  userCredits: 'subscription-user-credits',
  messageLimit: 'subscription-message-limit'
} as const;

/**
 * Hook para obter informações do plano do usuário
 */
export const useUserPlan = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: [SUBSCRIPTION_QUERY_KEYS.userPlan],
    queryFn: () => subscriptionService.getUserPlan(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated // Só executa se o usuário estiver autenticado
  });
};

/**
 * Hook para obter informações de créditos do usuário
 */
export const useUserCredits = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: [SUBSCRIPTION_QUERY_KEYS.userCredits],
    queryFn: () => subscriptionService.getUserCredits(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
    refetchOnWindowFocus: true, // Atualiza quando volta para a janela
    enabled: isAuthenticated // Só executa se o usuário estiver autenticado
  });
};

/**
 * Hook para verificar limite de mensagens
 */
export const useMessageLimit = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: [SUBSCRIPTION_QUERY_KEYS.messageLimit],
    queryFn: () => subscriptionService.checkMessageLimit(),
    staleTime: 30 * 1000, // 30 segundos
    retry: 1,
    refetchOnWindowFocus: true,
    enabled: isAuthenticated // Só executa se o usuário estiver autenticado
  });
};

/**
 * Hook para criar sessão de checkout (upgrade de plano)
 */
export const useCreateCheckout = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (priceId: string) => subscriptionService.createPlanCheckout(priceId),
    onSuccess: (checkoutUrl) => {
      // Redirecionar para o Stripe Checkout
      window.location.href = checkoutUrl;
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro no checkout',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

/**
 * Hook para comprar pacote de créditos
 */
export const useBuyCreditPack = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (pack: CreditPackType) => subscriptionService.createCreditCheckout(pack),
    onSuccess: (checkoutUrl) => {
      // Redirecionar para o Stripe Checkout
      window.location.href = checkoutUrl;
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao comprar créditos',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

/**
 * Hook para registrar envio de mensagem
 */
export const useRecordMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => subscriptionService.recordMessage(),
    onSuccess: () => {
      // Invalidar cache dos dados de uso
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_QUERY_KEYS.userCredits] });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_QUERY_KEYS.messageLimit] });
    },
    onError: (error: Error) => {
      // Se for erro de limite excedido, não mostrar toast (será tratado pela UI)
      if (!error.message.includes('Limite de mensagens excedido')) {
        toast({
          title: 'Erro ao enviar mensagem',
          description: error.message,
          variant: 'destructive'
        });
      }
      
      // Mesmo assim invalidar cache para atualizar dados
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_QUERY_KEYS.userCredits] });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_QUERY_KEYS.messageLimit] });
      
      throw error; // Re-throw para ser tratado pela UI
    }
  });
};

/**
 * Hook combinado para dados de assinatura completos
 */
export const useSubscriptionData = () => {
  const userPlanQuery = useUserPlan();
  const userCreditsQuery = useUserCredits();
  const messageLimitQuery = useMessageLimit();

  const isLoading = userPlanQuery.isLoading || userCreditsQuery.isLoading;
  const error = userPlanQuery.error || userCreditsQuery.error;
  
  const planInfo = userPlanQuery.data;
  const creditInfo = userCreditsQuery.data;
  const limitCheck = messageLimitQuery.data;

  // Calcular dados derivados
  const usagePercentage = planInfo 
    ? subscriptionService.calculateUsagePercentage(planInfo.messagesUsedToday, planInfo.dailyLimit)
    : 0;

  const isWithinLimit = limitCheck?.allowed || false;
  const isNearLimit = planInfo 
    ? subscriptionService.isNearLimit(planInfo.messagesUsedToday, planInfo.dailyLimit)
    : false;

  const usageStatus = planInfo 
    ? subscriptionService.getUsageStatus(
        planInfo.messagesUsedToday, 
        planInfo.dailyLimit, 
        planInfo.extraCredits
      )
    : { status: 'good' as const, message: 'Carregando...' };

  return {
    planInfo,
    creditInfo,
    limitCheck,
    isLoading,
    error,
    usagePercentage,
    isWithinLimit,
    isNearLimit,
    usageStatus,
    // Funções para atualizar dados
    refreshPlan: userPlanQuery.refetch,
    refreshCredits: userCreditsQuery.refetch,
    refreshLimit: messageLimitQuery.refetch
  };
};

/**
 * Hook para gerenciar estado de pagamento (callbacks do Stripe)
 */
export const usePaymentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handlePaymentSuccess = () => {
    // Invalidar todos os dados de assinatura
    queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_QUERY_KEYS.userPlan] });
    queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_QUERY_KEYS.userCredits] });
    queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_QUERY_KEYS.messageLimit] });

    toast({
      title: 'Pagamento realizado!',
      description: 'Seu plano foi atualizado com sucesso.',
      variant: 'default'
    });

    // Remover parâmetro da URL
    const url = new URL(window.location.href);
    url.searchParams.delete('payment');
    window.history.replaceState({}, '', url.toString());
  };

  const handlePaymentCancelled = () => {
    toast({
      title: 'Pagamento cancelado',
      description: 'Você pode tentar novamente a qualquer momento.',
      variant: 'default'
    });

    // Remover parâmetro da URL
    const url = new URL(window.location.href);
    url.searchParams.delete('payment');
    window.history.replaceState({}, '', url.toString());
  };

  return {
    handlePaymentSuccess,
    handlePaymentCancelled
  };
};

/**
 * Hook para verificação de limite antes de enviar mensagem
 */
export const useMessageLimitCheck = () => {
  const { data: limitCheck, refetch } = useMessageLimit();
  const recordMessage = useRecordMessage();

  const checkAndRecord = async (): Promise<boolean> => {
    try {
      // Primeiro verifica o limite
      const currentCheck = await refetch();
      
      if (!currentCheck.data?.allowed) {
        return false;
      }

      // Se pode enviar, registra a mensagem
      await recordMessage.mutateAsync();
      return true;
    } catch (error) {
      console.error('Erro ao verificar/registrar mensagem:', error);
      return false;
    }
  };

  return {
    canSendMessage: limitCheck?.allowed || false,
    limitCheck,
    checkAndRecord,
    isChecking: recordMessage.isPending
  };
};

/**
 * Hook para calcular preços e ofertas
 */
export const usePricingCalculations = (currentPlan?: Plan) => {
  const calculateSavings = (fromPlan: Plan, toPlan: Plan): number => {
    // Lógica de cálculo de economia baseada nos planos
    // Pode incluir descontos, promoções, etc.
    return 0;
  };

  const getUpgradeRecommendation = (plan: Plan): Plan | null => {
    if (plan === Plan.FREE) return Plan.FOCUS;
    if (plan === Plan.FOCUS) return Plan.PRO;
    return null;
  };

  const isUpgrade = (fromPlan: Plan, toPlan: Plan): boolean => {
    const planOrder = [Plan.FREE, Plan.FOCUS, Plan.PRO];
    return planOrder.indexOf(toPlan) > planOrder.indexOf(fromPlan);
  };

  return {
    calculateSavings,
    getUpgradeRecommendation,
    isUpgrade,
    recommendedPlan: currentPlan ? getUpgradeRecommendation(currentPlan) : Plan.FOCUS
  };
}; 