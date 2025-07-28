import { Check, Sparkles, Crown, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionData, useCreateCheckout } from '@/hooks/useSubscription';
import { Plan, PLAN_CONFIG } from '@/types/subscription';
import { PlanBadge } from '@/components/subscription';

const PricingSection = () => {
  const { isAuthenticated } = useAuth();
  const { planInfo } = useSubscriptionData();
  const createCheckout = useCreateCheckout();

  const plans = [
    {
      planKey: Plan.FREE,
      name: "Gratuito",
      price: "Grátis",
      period: "para sempre",
      title: "Comece de graça e experimente o básico",
      description: "Use a Lumi com até 5 mensagens diárias, organize até 3 quadros Kanban e controle seu tempo com Pomodoro ilimitado — tudo sem pagar nada. Ideal para quem está começando e quer sentir o gostinho da produtividade com alma.",
      cta: "Comece grátis agora!",
      icon: Star,
      gradient: "from-blue-500 to-cyan-600",
      features: [
        "5 mensagens diárias com Lumi",
        "Até 3 quadros Kanban",
        "Pomodoro ilimitado",
        "Sincronização básica",
        "Suporte por email"
      ],
      popular: false,
      delay: "0s",
      priceId: null
    },
    {
      planKey: Plan.FOCUS,
      name: "Focus",
      price: "R$ 12,90",
      period: "/mês",
      title: "Mais mensagens, mais quadros, mais controle",
      description: "Quer ir além? Com o plano Focus, tenha até 40 mensagens diárias com a Lumi, organize até 7 quadros Kanban e mantenha o Pomodoro sem limites. O equilíbrio perfeito entre custo e benefício para quem quer produtividade real.",
      cta: "Assinar Focus",
      icon: Sparkles,
      gradient: "from-purple-500 to-violet-600",
      features: [
        "40 mensagens diárias com Lumi",
        "Até 7 quadros Kanban",
        "Pomodoro avançado",
        "Relatórios de produtividade",
        "Sincronização em tempo real",
        "Suporte prioritário"
      ],
      popular: true,
      delay: "0.1s",
      priceId: PLAN_CONFIG[Plan.FOCUS].priceId
    },
    {
      planKey: Plan.PRO,
      name: "Pro",
      price: "R$ 19,90",
      period: "/mês",
      title: "Produtividade sem limites — para quem quer dominar o dia",
      description: "Liberte-se das restrições: mensagens ilimitadas com a Lumi, quadros Kanban ilimitados e Pomodoro livre para focar de verdade. O plano ideal para quem leva a produtividade a sério e quer resultados reais todos os dias.",
      cta: "Assinar Pro",
      icon: Crown,
      gradient: "from-pink-500 to-rose-600",
      features: [
        "Mensagens ilimitadas com Lumi",
        "Quadros Kanban ilimitados",
        "Todas as funcionalidades Premium",
        "IA avançada e insights personalizados",
        "Integrações com apps externos",
        "Suporte 24/7 dedicado",
        "Backup automático em nuvem"
      ],
      popular: false,
      delay: "0.2s",
      priceId: PLAN_CONFIG[Plan.PRO].priceId
    }
  ];

  const handlePlanSelect = (plan: typeof plans[0]) => {
    if (!isAuthenticated) {
      // Redirecionar para login se não estiver autenticado
      window.location.href = '/login';
      return;
    }

    if (plan.planKey === Plan.FREE) {
      // Plano gratuito - redirecionar para dashboard
      window.location.href = '/dashboard';
      return;
    }

    if (plan.priceId) {
      createCheckout.mutate(plan.priceId);
    }
  };

  const isCurrentPlan = (planKey: Plan) => {
    return planInfo?.plan === planKey;
  };

  const getButtonText = (plan: typeof plans[0]) => {
    if (!isAuthenticated) {
      return plan.planKey === Plan.FREE ? 'Começar grátis' : `Assinar ${plan.name}`;
    }

    if (isCurrentPlan(plan.planKey)) {
      return 'Plano atual';
    }

    if (plan.planKey === Plan.FREE) {
      return 'Plano gratuito';
    }

    return `Assinar ${plan.name}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <section id="precos" className="py-12 sm:py-16 lg:py-20 relative px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 rounded-full glass-effect mb-4 sm:mb-6">
            <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300 mr-2" />
            <span className="text-xs sm:text-sm text-purple-300 font-medium">Escolha seu plano</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-white mb-4 sm:mb-6 px-4">
            Invista na sua{" "}
            <span className="text-gradient">produtividade</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            Comece grátis e evolua conforme suas necessidades. Cada plano foi pensado 
            para potencializar sua produtividade sem comprometer sua experiência.
          </p>
        </div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            
            return (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                className={`relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/10 group ${
                  plan.popular ? 'ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/20' : ''
                }`}
                style={{ animationDelay: plan.delay }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                      Mais Popular
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isAuthenticated && isCurrentPlan(plan.planKey) && (
                  <div className="absolute -top-3 right-4">
                    <PlanBadge 
                      plan={plan.planKey}
                      isTrialActive={planInfo?.isTrialActive}
                      trialDaysRemaining={planInfo?.trialDaysRemaining}
                      size="sm"
                    />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* Plan Name */}
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-jakarta font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Plan Title */}
                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 leading-tight">
                  {plan.title}
                </h4>

                {/* Plan Description */}
                <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-slate-300 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button 
                  onClick={() => handlePlanSelect(plan)}
                  disabled={createCheckout.isPending || (isAuthenticated && isCurrentPlan(plan.planKey))}
                  className={`w-full font-semibold py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base ${
                    isAuthenticated && isCurrentPlan(plan.planKey)
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${plan.gradient} text-white`
                  }`}
                >
                  {createCheckout.isPending ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>{getButtonText(plan)}</span>
                      {!isAuthenticated || !isCurrentPlan(plan.planKey) ? (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sm sm:text-base text-slate-400 mb-4">
            Ainda tem dúvidas? Experimente grátis por 7 dias em qualquer plano pago
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-2 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm">
              Comparar planos
            </button>
            <button className="text-purple-300 hover:text-purple-200 font-medium py-2 px-6 rounded-xl transition-colors duration-300">
              Falar com vendas
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
