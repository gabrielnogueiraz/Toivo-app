import { Button } from '@/components/ui/button';
import { ArrowUp, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-float opacity-60" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-violet-400 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-violet-500 rounded-full animate-float opacity-50" style={{animationDelay: '0.5s'}} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-2 sm:px-4 rounded-full glass-effect mb-6 sm:mb-8 group hover-glow">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300 mr-2" />
          <span className="text-xs sm:text-sm text-purple-300 font-medium">Produtividade reimaginada</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-jakarta font-bold mb-4 sm:mb-6 leading-tight px-2">
          <span className="text-white">Cultive</span>{" "}
          <span className="text-gradient">produtividade</span>
          <br />
          <span className="text-white">com</span>{" "}
          <span className="text-gradient">alma</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 sm:mb-12 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
          Transforme suas tarefas diárias em um jardim de conquistas pessoais. 
          Com IA integrada e gamificação inteligente.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover-glow transition-all duration-300 group"
          >
            <Star className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Plantar minha primeira semente</span>
            <span className="sm:hidden">Começar agora</span>
            <ArrowUp className="ml-2 h-4 sm:h-5 w-4 sm:w-5 group-hover:rotate-45 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300"
          >
            ▶️ Ver vídeo teaser
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 justify-center items-center text-center max-w-2xl mx-auto">
          <div className="glass-effect px-4 py-3 sm:px-6 sm:py-4 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-purple-400">10K+</div>
            <div className="text-xs sm:text-sm text-slate-400">Jardins cultivados</div>
          </div>
          <div className="glass-effect px-4 py-3 sm:px-6 sm:py-4 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-violet-400">95%</div>
            <div className="text-xs sm:text-sm text-slate-400">Taxa de crescimento</div>
          </div>
          <div className="glass-effect px-4 py-3 sm:px-6 sm:py-4 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-purple-300">4.9★</div>
            <div className="text-xs sm:text-sm text-slate-400">Avaliação média</div>
          </div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
};

export default HeroSection;