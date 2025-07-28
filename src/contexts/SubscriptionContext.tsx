import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionData, usePaymentStatus } from '@/hooks/useSubscription';
import { SubscriptionContextType } from '@/types/subscription';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { handlePaymentSuccess, handlePaymentCancelled } = usePaymentStatus();
  
  const {
    planInfo,
    creditInfo,
    limitCheck,
    isLoading,
    error,
    usagePercentage,
    isWithinLimit,
    usageStatus,
    refreshPlan,
    refreshCredits,
    refreshLimit
  } = useSubscriptionData();

  // Verificar callbacks de pagamento na URL
  useEffect(() => {
    if (!isAuthenticated) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');

    if (paymentStatus === 'success') {
      handlePaymentSuccess();
    } else if (paymentStatus === 'cancelled') {
      handlePaymentCancelled();
    }
  }, [isAuthenticated, handlePaymentSuccess, handlePaymentCancelled]);

  // Se não estiver autenticado, retornar contexto vazio
  if (!isAuthenticated) {
    const emptyValue: SubscriptionContextType = {
      planInfo: null,
      creditInfo: null,
      loading: false,
      error: null,
      refreshPlanInfo: async () => {},
      refreshCreditInfo: async () => {},
      createCheckoutSession: async () => {
        throw new Error('Usuário não autenticado');
      },
      buyCreditPack: async () => {
        throw new Error('Usuário não autenticado');
      },
      checkMessageLimit: async () => ({ allowed: false }),
      recordMessage: async () => {
        throw new Error('Usuário não autenticado');
      },
      isWithinLimit: false,
      usagePercentage: 0
    };

    return (
      <SubscriptionContext.Provider value={emptyValue}>
        {children}
      </SubscriptionContext.Provider>
    );
  }

  const value: SubscriptionContextType = {
    planInfo,
    creditInfo: creditInfo || null,
    loading: isLoading,
    error: error?.message || null,
    
    // Funções de atualização
    refreshPlanInfo: async () => {
      await refreshPlan();
    },
    
    refreshCreditInfo: async () => {
      await refreshCredits();
    },

    // Funções de checkout (implementadas nos hooks)
    createCheckoutSession: async (priceId: string) => {
      // Esta função será sobrescrita pelos hooks que a usam
      throw new Error('createCheckoutSession deve ser implementada pelo hook useCreateCheckout');
    },

    buyCreditPack: async (pack) => {
      // Esta função será sobrescrita pelos hooks que a usam
      throw new Error('buyCreditPack deve ser implementada pelo hook useBuyCreditPack');
    },

    checkMessageLimit: async () => {
      const result = await refreshLimit();
      return result.data || { allowed: false };
    },

    recordMessage: async () => {
      // Esta função será sobrescrita pelo hook useRecordMessage
      throw new Error('recordMessage deve ser implementada pelo hook useRecordMessage');
    },

    // Dados computados
    isWithinLimit,
    usagePercentage
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
};

// Hook personalizado para verificar se tem acesso a recursos premium
export const usePremiumFeatures = () => {
  const { planInfo } = useSubscriptionContext();
  
  const hasUnlimitedMessages = planInfo?.dailyLimit === Infinity;
  const hasPremiumSupport = planInfo?.plan !== 'FREE';
  const hasAdvancedFeatures = planInfo?.plan === 'PRO';
  
  return {
    hasUnlimitedMessages,
    hasPremiumSupport,
    hasAdvancedFeatures,
    isPremium: hasPremiumSupport
  };
};

// Hook para verificar se deve mostrar upgrade prompts
export const useUpgradePrompts = () => {
  const { planInfo, isWithinLimit, usagePercentage } = useSubscriptionContext();
  
  const shouldShowTrialWarning = planInfo?.isTrialActive && 
    (planInfo?.trialDaysRemaining || 0) <= 3;
    
  const shouldShowUsageWarning = usagePercentage >= 80 && isWithinLimit;
  
  const shouldShowUpgradeModal = !isWithinLimit && planInfo?.extraCredits === 0;
  
  const shouldShowCreditOffer = !isWithinLimit && planInfo?.extraCredits === 0;

  return {
    shouldShowTrialWarning,
    shouldShowUsageWarning,
    shouldShowUpgradeModal,
    shouldShowCreditOffer,
    trialDaysRemaining: planInfo?.trialDaysRemaining || 0
  };
}; 