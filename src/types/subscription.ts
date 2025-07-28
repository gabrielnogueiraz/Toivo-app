// Enums e tipos base
export enum Plan {
  FREE = "FREE",
  FOCUS = "FOCUS", 
  PRO = "PRO"
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  TRIAL = "TRIAL",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED"
}

// Configurações dos planos
export interface PlanConfig {
  name: string;
  price: number;
  dailyLimit: number;
  features: string[];
  priceId: string | null;
  popular?: boolean;
  badge?: string;
}

export const PLAN_CONFIG: Record<Plan, PlanConfig> = {
  [Plan.FREE]: {
    name: "Gratuito",
    price: 0,
    dailyLimit: 5,
    features: ["5 mensagens por dia", "Acesso básico ao Lumi"],
    priceId: null
  },
  [Plan.FOCUS]: {
    name: "Focus",
    price: 12.90,
    dailyLimit: 40,
    features: ["40 mensagens por dia", "Melhor custo-benefício"],
    priceId: import.meta.env.VITE_STRIPE_FOCUS_PRICE_ID || null,
    popular: true,
    badge: "Mais Popular"
  },
  [Plan.PRO]: {
    name: "Pro",
    price: 19.90,
    dailyLimit: Infinity,
    features: ["Mensagens ilimitadas", "Acesso completo"],
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || null
  }
};

// Pacotes de créditos
export interface CreditPack {
  name: string;
  price: number;
  credits: number;
  description: string;
  recommended?: boolean;
}

export const CREDIT_PACKS = {
  pack5: {
    name: "5 Créditos",
    price: 4.90,
    credits: 5,
    description: "Para uso ocasional"
  },
  pack20: {
    name: "20 Créditos", 
    price: 9.90,
    credits: 20,
    description: "Melhor valor",
    recommended: true
  }
} as const;

export type CreditPackType = keyof typeof CREDIT_PACKS;

// Interfaces para respostas da API
export interface UserPlanInfo {
  plan: Plan;
  isTrialActive: boolean;
  trialEndsAt: string | null;
  trialDaysRemaining: number | null;
  dailyLimit: number;
  messagesUsedToday: number;
  extraCredits: number;
  status: SubscriptionStatus;
  subscriptionId?: string;
}

export interface CreditInfo {
  extraCredits: number;
  dailyLimit: number;
  messagesUsedToday: number;
  canSendMessage: boolean;
}

export interface CheckoutSession {
  url: string;
  sessionId?: string;
}

export interface MessageLimitCheck {
  allowed: boolean;
  reason?: "plan_allows" | "within_daily_limit" | "using_credits" | "limit_exceeded";
  creditsUsed?: boolean;
  dailyLimitRemaining?: number;
  extraCreditsRemaining?: number;
}

// Interfaces para requisições
export interface CreateCheckoutSessionRequest {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface BuyCreditPackRequest {
  pack: CreditPackType;
}

// Interfaces para respostas da API
export interface SubscriptionApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SubscriptionApiError {
  success: false;
  message: string;
  error?: string;
}

// Contexto de assinatura
export interface SubscriptionContextType {
  planInfo: UserPlanInfo | null;
  creditInfo: CreditInfo | null;
  loading: boolean;
  error: string | null;
  refreshPlanInfo: () => Promise<void>;
  refreshCreditInfo: () => Promise<void>;
  createCheckoutSession: (priceId: string) => Promise<string>;
  buyCreditPack: (pack: CreditPackType) => Promise<string>;
  checkMessageLimit: () => Promise<MessageLimitCheck>;
  recordMessage: () => Promise<void>;
  isWithinLimit: boolean;
  usagePercentage: number;
}

// Tipos utilitários
export type PlanFeatures = {
  [K in Plan]: PlanConfig;
};

export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: Plan;
  reason?: "limit_exceeded" | "trial_expired" | "upgrade_recommended";
  onUpgrade?: (priceId: string) => void;
}

export interface PlanBadgeProps {
  plan: Plan;
  isTrialActive?: boolean;
  trialDaysRemaining?: number | null;
  size?: "sm" | "md" | "lg";
  showTrial?: boolean;
}

export interface UsageCounterProps {
  used: number;
  limit: number;
  extraCredits?: number;
  showPercentage?: boolean;
  showProgressBar?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface PricingCardProps {
  plan: Plan;
  config: PlanConfig;
  isCurrentPlan?: boolean;
  isTrialActive?: boolean;
  onSelectPlan?: (priceId: string) => void;
  loading?: boolean;
} 