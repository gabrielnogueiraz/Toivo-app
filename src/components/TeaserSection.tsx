import { Button } from '@/components/ui/button';
import teaserVideo from '@/assets/teaser.mp4';

const TeaserSection = () => {
  return (
    <section id="preview" className="py-12 sm:py-16 lg:py-20 relative px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Video Preview */}
          <div className="relative group order-2 lg:order-1">
            <div className="aspect-video rounded-2xl glass-effect p-4 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden hover-glow">
              {/* Video player */}
              <video
                className="rounded-xl w-full h-full object-cover shadow-2xl border-2 border-purple-900/30"
                src={teaserVideo}
                controls
                preload="metadata"
                poster="/assets/teaser-poster.png"
                style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)' }}
              >
                Seu navegador não suporta o elemento <code>video</code>.
              </video>
              {/* Floating elements */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-float opacity-60" />
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-400 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}} />
            </div>
            
            {/* Interactive buttons around video */}
            <Button 
              size="sm" 
              className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 rounded-full w-8 h-8 sm:w-12 sm:h-12 bg-purple-600 hover:bg-purple-700 shadow-lg hover-glow text-xs sm:text-base"
            >
              ✨
            </Button>
            <Button 
              size="sm" 
              className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 rounded-full w-8 h-8 sm:w-12 sm:h-12 bg-violet-600 hover:bg-violet-700 shadow-lg hover-glow text-xs sm:text-base"
            >
              🚀
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-jakarta font-bold text-white mb-3 sm:mb-4">
                Veja o futuro da{" "}
                <span className="text-gradient">produtividade</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Descubra como o Toivo transforma tarefas mundanas em experiências 
                engajantes. Cada ação alimenta seu crescimento pessoal.
              </p>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center p-3 sm:p-4 glass-effect rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">8s</div>
                <div className="text-xs sm:text-sm text-slate-400">de teaser</div>
              </div>
              <div className="text-center p-3 sm:p-4 glass-effect rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-violet-400 mb-1 sm:mb-2">∞</div>
                <div className="text-xs sm:text-sm text-slate-400">possibilidades</div>
              </div>
            </div>

            {/* Features preview */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg hover-glow">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm">🌱</span>
                </div>
                <div>
                  <div className="font-medium text-white text-sm sm:text-base">Crescimento visual</div>
                  <div className="text-xs sm:text-sm text-slate-400">Veja seu progresso florescer</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg hover-glow">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm">🤖</span>
                </div>
                <div>
                  <div className="font-medium text-white text-sm sm:text-base">Lumi, sua IA</div>
                  <div className="text-xs sm:text-sm text-slate-400">Assistente inteligente e carismática</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeaserSection;