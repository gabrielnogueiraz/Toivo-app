import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-violet-900/20" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA */}
        <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 hover-glow">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-2 sm:px-4 rounded-full bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm text-purple-300 font-medium">🚀 Comece sua jornada hoje</span>
          </div>

          {/* Main heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Transforme sua rotina em um{" "}
            <span className="text-gradient">jardim de conquistas</span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 sm:mb-12 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-2">
            Junte-se a milhares de pessoas que já descobriram uma forma mais 
            gratificante e eficiente de gerenciar suas tarefas diárias.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-glow transition-all duration-300 group"
            >
              <span className="hidden sm:inline">Criar minha conta gratuita</span>
              <span className="sm:hidden">Criar conta gratuita</span>
              <ArrowUp className="ml-2 h-4 sm:h-5 w-4 sm:w-5 group-hover:rotate-45 transition-transform" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center text-xs sm:text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Gratuito por 30 dias</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center">
          <div className="glass-effect p-4 sm:p-6 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-purple-400 mb-1 sm:mb-2">10,000+</div>
            <div className="text-xs sm:text-sm text-slate-400">Usuários ativos</div>
          </div>
          <div className="glass-effect p-4 sm:p-6 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-violet-400 mb-1 sm:mb-2">500K+</div>
            <div className="text-xs sm:text-sm text-slate-400">Tarefas concluídas</div>
          </div>
          <div className="glass-effect p-4 sm:p-6 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-purple-300 mb-1 sm:mb-2">4.9★</div>
            <div className="text-xs sm:text-sm text-slate-400">Avaliação na App Store</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;