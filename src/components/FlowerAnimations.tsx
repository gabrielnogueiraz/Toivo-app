import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FlowerCreationAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  flowerCount?: number;
  hasLegendary?: boolean;
}

export const FlowerCreationAnimation = ({ 
  isVisible, 
  onComplete, 
  flowerCount = 1,
  hasLegendary = false 
}: FlowerCreationAnimationProps) => {
  const [stage, setStage] = useState<'seed' | 'growing' | 'blooming' | 'celebrating'>('seed');
  
  useEffect(() => {
    if (!isVisible) return;
    
    const stages = [
      { stage: 'seed', duration: 800 },
      { stage: 'growing', duration: 1000 },
      { stage: 'blooming', duration: 1200 },
      { stage: 'celebrating', duration: 2000 }
    ];
    
    let currentIndex = 0;
    
    const nextStage = () => {
      if (currentIndex < stages.length) {
        setStage(stages[currentIndex].stage as any);
        setTimeout(() => {
          currentIndex++;
          if (currentIndex < stages.length) {
            nextStage();
          } else {
            onComplete();
          }
        }, stages[currentIndex].duration);
      }
    };
    
    nextStage();
  }, [isVisible, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-card rounded-3xl p-8 text-center max-w-md mx-4 shadow-2xl">
        {/* Animação da flor */}
        <div className="mb-6 relative">
          <motion.div
            key={stage}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl mb-4"
          >
            {stage === 'seed' && '🌱'}
            {stage === 'growing' && '🌿'}
            {stage === 'blooming' && (hasLegendary ? '🌹' : '🌸')}
            {stage === 'celebrating' && (
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {hasLegendary ? '🌹' : '🌸'}
              </motion.div>
            )}
          </motion.div>
          
          {/* Partículas de celebração */}
          {stage === 'celebrating' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: Math.cos(i * 45 * Math.PI / 180) * 80,
                    y: Math.sin(i * 45 * Math.PI / 180) * 80,
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: i * 0.1,
                    repeat: Infinity 
                  }}
                  className="absolute top-1/2 left-1/2 text-2xl"
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Texto da animação */}
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {stage === 'seed' && (
            <p className="text-lg font-medium text-card-foreground">
              Plantando sua conquista...
            </p>
          )}
          {stage === 'growing' && (
            <p className="text-lg font-medium text-card-foreground">
              Sua flor está crescendo...
            </p>
          )}
          {stage === 'blooming' && (
            <div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">
                {hasLegendary ? '🎉 Flor Lendária Desbloqueada! 🎉' : '🌸 Nova Flor Criada! 🌸'}
              </h3>
              <p className="text-muted-foreground">
                {flowerCount === 1 
                  ? `Sua nova flor foi adicionada ao jardim!`
                  : `${flowerCount} novas flores foram adicionadas ao jardim!`
                }
              </p>
            </div>
          )}
          {stage === 'celebrating' && (
            <div>
              <h3 className="text-2xl font-bold text-card-foreground mb-3">
                Parabéns! 🎊
              </h3>
              <p className="text-muted-foreground">
                Continue completando tarefas para fazer seu jardim florescer!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

interface LegendaryFlowerCelebrationProps {
  isVisible: boolean;
  flowerName: string;
  onComplete: () => void;
}

export const LegendaryFlowerCelebration = ({ 
  isVisible, 
  flowerName, 
  onComplete 
}: LegendaryFlowerCelebrationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center z-50"
    >
      <div className="bg-card rounded-3xl p-8 text-center max-w-lg mx-4 shadow-2xl border-2 border-amber-300">
        {/* Fogos de artifício */}
        <div className="mb-6 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🌹
          </motion.div>
          
          {/* Efeitos visuais */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  opacity: [1, 0.8, 0],
                  x: Math.cos(i * 30 * Math.PI / 180) * 100,
                  y: Math.sin(i * 30 * Math.PI / 180) * 100,
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.1,
                  repeat: Infinity 
                }}
                className="absolute top-1/2 left-1/2 text-3xl"
              >
                {i % 3 === 0 ? '✨' : i % 3 === 1 ? '🎆' : '💫'}
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-amber-600 mb-3">
            FLOR LENDÁRIA DESBLOQUEADA!
          </h2>
          <p className="text-xl font-semibold text-card-foreground mb-2">
            {flowerName}
          </p>
          <p className="text-muted-foreground">
            Uma conquista verdadeiramente especial! 🏆
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
