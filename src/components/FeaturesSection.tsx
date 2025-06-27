import { ArrowUp, CheckSquare, Timer, Kanban, Calendar, Target, Bot, Zap } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: CheckSquare,
      title: "Lista de tarefas",
      description: "Organize suas atividades com prioridades inteligentes e lembretes personalizados.",
      gradient: "from-blue-500 to-cyan-600",
      delay: "0s"
    },
    {
      icon: Timer,
      title: "Timer Pomodoro",
      description: "Mantenha o foco com sessões cronometradas e pausas estratégicas para máxima produtividade.",
      gradient: "from-red-500 to-rose-600",
      delay: "0.1s"
    },
    {
      icon: Kanban,
      title: "Quadro Kanban",
      description: "Visualize seu fluxo de trabalho com quadros dinâmicos e arrastar-e-soltar intuitivo.",
      gradient: "from-green-500 to-emerald-600",
      delay: "0.2s"
    },
    {
      icon: Calendar,
      title: "Calendário",
      description: "Sincronize prazos e compromissos com uma visão clara da sua agenda semanal.",
      gradient: "from-purple-500 to-violet-600",
      delay: "0.3s"
    },
    {
      icon: Target,
      title: "Controle de foco",
      description: "Bloqueie distrações e mantenha-se concentrado nas tarefas mais importantes.",
      gradient: "from-orange-500 to-amber-600",
      delay: "0.4s"
    },
    {
      icon: Bot,
      title: "Assistente IA",
      description: "Lumi analisa seus padrões e sugere otimizações para melhorar sua eficiência.",
      gradient: "from-pink-500 to-rose-600",
      delay: "0.5s"
    }
  ];

  return (
    <section id="recursos" className="py-12 sm:py-16 lg:py-20 relative px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 rounded-full glass-effect mb-4 sm:mb-6">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300 mr-2" />
            <span className="text-xs sm:text-sm text-purple-300 font-medium">Recursos essenciais</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-white mb-4 sm:mb-6 px-4">
            Tudo que você precisa para{" "}
            <span className="text-gradient">prosperar</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            Uma suíte completa de ferramentas de produtividade, desenvolvidas para 
            trabalhar em harmonia e potencializar seu crescimento pessoal.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group p-4 sm:p-6 glass-effect rounded-2xl hover-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-jakarta font-semibold text-white mb-2 sm:mb-3 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 sm:mb-4">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <div className="flex items-center text-purple-400 text-xs sm:text-sm font-medium group-hover:text-purple-300 transition-colors cursor-pointer">
                  {/* <span>Saiba mais</span> */}
                  {/* <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform rotate-45" /> */}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 glass-effect rounded-full hover-glow group cursor-pointer">
            <span className="text-sm sm:text-base text-purple-300 font-medium mr-2">Explore todos os recursos</span>
            <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 group-hover:translate-x-1 transition-transform rotate-45" />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FeaturesSection;