import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Sparkles, 
  MessageCircle, 
  ArrowRight, 
  Check,
  Coins,
  CreditCard,
  RotateCcw,
  Mail,
  Shield
} from 'lucide-react';
import { 
  UpgradeModalProps, 
  Plan, 
  PLAN_CONFIG, 
  CREDIT_PACKS 
} from '@/types/subscription';
import { useCreateCheckout, useBuyCreditPack } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlan = Plan.FREE,
  reason = 'limit_exceeded',
  onUpgrade
}) => {
  const createCheckout = useCreateCheckout();
  const buyCreditPack = useBuyCreditPack();

  const getModalContent = () => {
    switch (reason) {
      case 'limit_exceeded':
        return {
          title: 'Limite de mensagens atingido',
          description: 'Você usou todas as mensagens do dia. Escolha uma opção para continuar usando a Lumi.',
          showCredits: true,
          showPlans: true
        };
      case 'trial_expired':
        return {
          title: 'Seu trial expirou',
          description: 'Continue aproveitando todos os recursos da Lumi com um de nossos planos.',
          showCredits: false,
          showPlans: true
        };
      case 'upgrade_recommended':
        return {
          title: 'Potencialize sua produtividade',
          description: 'Desbloqueie todo o potencial da Lumi com mensagens ilimitadas.',
          showCredits: false,
          showPlans: true
        };
      default:
        return {
          title: 'Upgrade recomendado',
          description: 'Melhore sua experiência com a Lumi.',
          showCredits: true,
          showPlans: true
        };
    }
  };

  const content = getModalContent();
  
  const availablePlans = Object.entries(PLAN_CONFIG).filter(([planKey]) => {
    return planKey !== currentPlan && planKey !== Plan.FREE;
  });

  const handlePlanSelect = async (priceId: string) => {
    if (onUpgrade) {
      onUpgrade(priceId);
    } else {
      createCheckout.mutate(priceId);
    }
  };

  const handleCreditPurchase = (packKey: keyof typeof CREDIT_PACKS) => {
    buyCreditPack.mutate(packKey);
  };

  const isLoading = createCheckout.isPending || buyCreditPack.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Créditos rápidos */}
          {content.showCredits && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Coins className="w-5 h-5 text-orange-500" />
                Solução rápida - Créditos extras
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(CREDIT_PACKS).map(([packKey, pack]) => (
                  <Card 
                    key={packKey}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:scale-105',
                      ('recommended' in pack && pack.recommended) && 'ring-2 ring-primary/50'
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{pack.name}</CardTitle>
                        {'recommended' in pack && pack.recommended && (
                          <Badge className="bg-primary text-primary-foreground">
                            Recomendado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pack.description}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold">
                          R$ {pack.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {pack.credits} mensagens
                        </span>
                      </div>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        variant={('recommended' in pack && pack.recommended) ? 'default' : 'outline'}
                        onClick={() => handleCreditPurchase(packKey as keyof typeof CREDIT_PACKS)}
                        disabled={isLoading}
                      >
                        <Coins className="w-4 h-4 mr-2" />
                        Comprar agora
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Divisor */}
          {content.showCredits && content.showPlans && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou escolha um plano mensal
                </span>
              </div>
            </div>
          )}

          {/* Planos mensais */}
          {content.showPlans && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-500" />
                Planos mensais - Melhor valor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePlans.map(([planKey, planConfig]) => {
                  const Icon = planKey === Plan.PRO ? Crown : Sparkles;
                  const isPopular = planConfig.popular;
                  
                  return (
                    <Card 
                      key={planKey}
                                          className={cn(
                      'cursor-pointer transition-all duration-200 hover:scale-105',
                      isPopular && 'ring-2 ring-primary/50'
                    )}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-purple-500" />
                            <CardTitle className="text-xl">{planConfig.name}</CardTitle>
                          </div>
                          {isPopular && (
                            <Badge className="bg-primary text-primary-foreground">
                              Mais Popular
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">
                            R$ {planConfig.price.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground">/mês</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {planConfig.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => planConfig.priceId && handlePlanSelect(planConfig.priceId)}
                          disabled={isLoading || !planConfig.priceId}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Assinar {planConfig.name}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Informações adicionais */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Pagamento seguro via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-primary" />
              <span>Cancele a qualquer momento</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-foreground" />
              <span>Suporte dedicado incluso</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal; 