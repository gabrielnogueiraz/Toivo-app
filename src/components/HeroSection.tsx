import { Button } from '@/components/ui/button';
import { ArrowUp, Star } from 'lucide-react';
import WaitlistInput from '@/components/ui/waitlistInput';

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

        {/* Lista de espera - Slogan e input */}
        <div className="flex flex-col items-center justify-center mb-12 sm:mb-16 px-4 w-full">
          <span className="block text-xs sm:text-sm text-slate-300 mb-5 text-center max-w-xl">
            Adicione seu e-mail para ser notificado quando o aplicativo for lançado e garanta acesso antecipado à experiência mais inovadora de produtividade.
          </span>
          {/* Input para lista de espera */}
          <div className="w-full flex justify-center">
            {/* WaitlistInput */}
            <WaitlistInput />
          </div>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 justify-center items-center text-center max-w-2xl mx-auto">
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
        </div> */}
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
};

export default HeroSection;