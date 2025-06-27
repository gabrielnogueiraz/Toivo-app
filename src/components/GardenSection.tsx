import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

const GardenSection = () => {
  const flowers = [
    { color: "bg-green-400", priority: "baixa", count: 12, icon: LocalFloristIcon, iconColor: "text-green-400" },
    { color: "bg-orange-400", priority: "média", count: 8, icon: LocalFloristIcon, iconColor: "text-orange-400" },
    { color: "bg-red-400", priority: "alta", count: 5, icon: LocalFloristIcon, iconColor: "text-red-400" },
    { color: "bg-purple-400", priority: "rara", count: 2, icon: LocalFloristIcon, iconColor: "text-purple-400" }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-effect mb-6">
            <LocalFloristIcon className="w-4 h-4 text-purple-300 mr-2" />
            <span className="text-sm text-purple-300 font-medium">Seu progresso visual</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-jakarta font-bold text-white mb-6">
            Seu{" "}
            <span className="text-gradient">Jardim Virtual</span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Cada tarefa concluída faz uma nova flor crescer. Acompanhe seu crescimento 
            pessoal através de um jardim único e personalizado.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Garden Visualization */}
          <div className="relative">
            <div className="aspect-square max-w-lg mx-auto relative glass-effect rounded-2xl p-8 hover-glow">
              {/* Garden background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/20" />
              
              {/* Animated flowers */}
              <div className="relative h-full flex items-end justify-center space-x-2">
                {/* Ground line */}
                <div className="absolute bottom-8 left-8 right-8 h-1 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-full" />
                
                {/* Flowers */}
                <div className="flex items-end space-x-3">
                  {/* Green flowers (low priority) */}
                  {[...Array(4)].map((_, i) => (
                    <LocalFloristIcon 
                      key={`green-${i}`} 
                      className="text-green-400 text-2xl animate-float" 
                      style={{animationDelay: `${i * 0.3}s`}}
                    />
                  ))}
                  
                  {/* Orange flowers (medium priority) */}
                  {[...Array(3)].map((_, i) => (
                    <LocalFloristIcon 
                      key={`orange-${i}`} 
                      className="text-orange-400 text-3xl animate-float" 
                      style={{animationDelay: `${i * 0.4 + 1}s`}}
                    />
                  ))}
                  
                  {/* Red flowers (high priority) */}
                  {[...Array(2)].map((_, i) => (
                    <LocalFloristIcon 
                      key={`red-${i}`} 
                      className="text-red-400 text-4xl animate-float" 
                      style={{animationDelay: `${i * 0.5 + 1.5}s`}}
                    />
                  ))}
                  
                  {/* Purple rare flower */}
                  <LocalFloristIcon 
                    className="text-purple-400 text-5xl animate-float animate-pulse-glow" 
                    style={{animationDelay: '2s'}}
                  />
                </div>
                
                {/* Floating particles */}
                <div className="absolute top-4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float opacity-60" />
                <div className="absolute top-8 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}} />
                <div className="absolute top-12 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}} />
              </div>
              
              {/* Growth level indicator */}
              <div className="absolute top-4 right-4 px-3 py-1 glass-effect rounded-full">
                <div className="flex items-center">
                  <span className="text-xs text-green-400 font-medium">Nível 7</span>
                  <StarIcon className="w-3 h-3 text-green-400 ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Garden Stats & Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-jakarta font-bold text-white mb-4">
                Como funciona seu jardim
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Suas flores crescem baseadas na prioridade e complexidade das tarefas. 
                Quanto mais você se dedica, mais diverso e colorido fica seu jardim.
              </p>
            </div>

            {/* Flower legend */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Tipos de flores:</h4>
              {flowers.map((flower, index) => {
                const IconComponent = flower.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 glass-effect rounded-lg hover-glow group">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`${flower.iconColor} text-2xl`} />
                      <div>
                        <div className="font-medium text-white capitalize">
                          Prioridade {flower.priority}
                        </div>
                        <div className="text-sm text-slate-400">
                          Tarefas {flower.priority === 'rara' ? 'especiais' : `de prioridade ${flower.priority}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-400">{flower.count}</div>
                      <div className="text-xs text-slate-400">flores</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Achievement hint */}
            <div className="p-4 glass-effect rounded-lg border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <EmojiEventsIcon className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-purple-300">Próxima conquista</span>
              </div>
              <p className="text-sm text-slate-300">
                Complete 5 tarefas de alta prioridade para desbloquear o "Jardim Dourado"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GardenSection;