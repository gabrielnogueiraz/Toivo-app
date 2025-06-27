import { Brain, Zap, Sparkles, Bot, Circle } from 'lucide-react';

const LumiSection = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Personalidade carismática",
      description: "Lumi adapta sua comunicação ao seu estilo, tornando cada interação única e motivadora.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Brain,
      title: "Inteligência adaptativa",
      description: "Aprende com seus hábitos e sugere melhorias personalizadas para seu crescimento.",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: Zap,
      title: "Processamento inteligente",
      description: "Organiza suas tarefas de forma intuitiva, priorizando o que realmente importa.",
      gradient: "from-blue-500 to-cyan-600"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 rounded-full glass-effect mb-4 sm:mb-6">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300 mr-2" />
            <span className="text-xs sm:text-sm text-purple-300 font-medium">Conheça sua assistente</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-white mb-4 sm:mb-6 px-4">
            Esta é a{" "}
            <span className="text-gradient">Lumi</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            Sua assistente de produtividade com IA. Ela não apenas organiza suas tarefas, 
            mas entende suas motivações e te acompanha na jornada de crescimento pessoal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Lumi Avatar/Visualization */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto relative">
              {/* Main avatar container */}
              <div className="absolute inset-0 rounded-full glass-effect p-6 sm:p-8 animate-pulse-glow">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600/20 to-violet-600/20 flex items-center justify-center relative overflow-hidden">
                  {/* Lumi face/representation - Increased size */}
                  <Bot className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] text-purple-300 animate-float" />
                  
                  {/* Orbiting elements */}
                  <div className="absolute top-3 right-6 sm:top-4 sm:right-8 w-3 h-3 sm:w-4 sm:h-4 bg-purple-400 rounded-full animate-float opacity-60" />
                  <div className="absolute bottom-6 left-3 sm:bottom-8 sm:left-4 w-2 h-2 sm:w-3 sm:h-3 bg-violet-400 rounded-full animate-float opacity-80" style={{animationDelay: '1s'}} />
                  <div className="absolute top-1/2 left-1 sm:left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-float opacity-40" style={{animationDelay: '2s'}} />
                </div>
              </div>
              
              {/* Status indicators */}
              <div className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2 px-2 py-1 sm:px-3 glass-effect rounded-full">
                <div className="flex items-center">
                  <Circle className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-green-400 mr-1 fill-current" />
                  <span className="text-xs text-green-400 font-medium">Online</span>
                </div>
              </div>
              
              <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 sm:px-4 sm:py-2 glass-effect rounded-full">
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm text-purple-300 font-medium">Pronta para ajudar!</span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300 ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  className="p-4 sm:p-6 glass-effect rounded-xl hover-glow group transition-all duration-300"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <IconComponent className="text-white text-base sm:text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-jakarta font-semibold text-white mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive demo hint */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 glass-effect rounded-full hover-glow group cursor-pointer">
            <span className="text-sm sm:text-base text-purple-300 font-medium mr-2">Experimente conversar com a Lumi</span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse group-hover:animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LumiSection;