import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Pause, RotateCcw, Settings, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface MagicalFlowerGrowthProps {
  progress: number; // 0-100
  isActive: boolean;
  flowerType?: 'common' | 'rare' | 'legendary';
  className?: string;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onOpenSettings?: () => void;
  isRunning?: boolean;
}

const flowerEmojis = {
  common: ['🌸', '🌼', '🌻', '🌺', '🌷'],
  rare: ['🌹', '🥀', '🪷', '�', '🏵️'],
  legendary: ['🌟', '✨', '🎆', '�', '💫']
};

const soilStages = [
  '', // Solo vazio (apenas o vaso)
  '🌱', // Primeira semente
  '🌿', // Broto pequeno
  '🍃', // Folhas crescendo
  '', // Preparando para flor (será substituído pela flor final)
];

// Partículas mágicas que sobem em espiral
interface MagicParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
  color: string;
}

export const MagicalFlowerGrowth = ({ 
  progress, 
  isActive, 
  flowerType = 'common',
  className,
  onStart,
  onPause,
  onReset,
  onOpenSettings,
  isRunning = false
}: MagicalFlowerGrowthProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [particles, setParticles] = useState<MagicParticle[]>([]);
  const [breathingScale, setBreathingScale] = useState(1);
  const [showGlow, setShowGlow] = useState(false);

  // Efeito de respiração suave para elementos vivos
  useEffect(() => {
    const breathingInterval = setInterval(() => {
      setBreathingScale(prev => prev === 1 ? 1.02 : 1);
    }, 3000);

    return () => clearInterval(breathingInterval);
  }, []);

  useEffect(() => {
    const stage = Math.floor((progress / 100) * soilStages.length);
    const newStage = Math.min(stage, soilStages.length - 1);
    
    if (newStage !== currentStage) {
      setCurrentStage(newStage);
      
      // Efeito especial quando muda de estágio
      if (newStage > 0) {
        setShowGlow(true);
        setTimeout(() => setShowGlow(false), 1500);
      }
    }
    
    // Mostrar sparkles em marcos importantes (respiração lenta)
    if (progress > 0 && (progress % 20 === 0 || progress >= 100)) {
      setShowSparkles(true);
      
      // Gerar partículas mágicas com cores baseadas no tipo de flor
      const particleCount = progress >= 100 ? 20 : 12;
      const colors = {
        common: ['#A3BE8C', '#88C0D0', '#81A1C1'],
        rare: ['#B48EAD', '#D08770', '#EBCB8B'], 
        legendary: ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD']
      };
      
      const newParticles: MagicParticle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        delay: i * 0.1,
        color: colors[flowerType][Math.floor(Math.random() * colors[flowerType].length)]
      }));
      
      setParticles(newParticles);
      
      setTimeout(() => {
        setShowSparkles(false);
        setParticles([]);
      }, progress >= 100 ? 4000 : 2500);
    }
  }, [progress, currentStage, flowerType]);

  const getFlowerForStage = () => {
    if (currentStage === 0) return null;
    if (currentStage < soilStages.length - 1) {
      return (
        <motion.span
          key={currentStage}
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ 
            scale: breathingScale, 
            opacity: 1, 
            y: 0 
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 1.2
          }}
          className="text-4xl"
        >
          {soilStages[currentStage]}
        </motion.span>
      );
    }
    
    // Estágio final - flor completa com animação especial inspirada em Ghibli
    const flowers = flowerEmojis[flowerType];
    const selectedFlower = flowers[Math.floor(Date.now() / 10000) % flowers.length];
    
    return (
      <motion.div
        key="final-flower"
        initial={{ scale: 0, opacity: 0, y: 30 }}
        animate={{ 
          scale: isFullyGrown ? [1, 1.1, 1.05, 1] : 1,
          opacity: 1,
          y: 0,
          rotate: isFullyGrown ? [0, 2, -2, 0] : 0
        }}
        transition={{ 
          type: "spring",
          stiffness: 150,
          damping: 10,
          duration: 2,
          repeat: isFullyGrown ? Infinity : 0,
          repeatType: "reverse"
        }}
        className="text-6xl relative"
      >
        {/* Halo de luz ao redor da flor */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={isFullyGrown ? {
            boxShadow: [
              "0 0 20px rgba(255, 255, 255, 0.3)",
              "0 0 40px rgba(255, 255, 255, 0.6)", 
              "0 0 20px rgba(255, 255, 255, 0.3)"
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <span className="relative z-10">{selectedFlower}</span>
        
        {/* Pétalas caindo para flores lendárias */}
        {flowerType === 'legendary' && isFullyGrown && (
          <motion.div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
            animate={{ 
              y: [0, 100],
              opacity: [1, 0],
              rotate: [0, 180]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            ✨
          </motion.div>
        )}
      </motion.div>
    );
  };

  const isPotEmpty = progress === 0;
  const isFullyGrown = progress >= 100;

  return (
    <div className={cn(
      "relative w-full max-w-lg mx-auto",
      className
    )}>
      {/* Card elegante com gradiente suave */}
      <motion.div
        className={cn(
          "relative p-8 rounded-3xl border-2 shadow-2xl backdrop-blur-sm overflow-hidden",
          "bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80",
          "border-gray-200/50 dark:border-gray-700/50",
          showGlow && "shadow-lg shadow-primary/25"
        )}
        animate={showGlow ? {
          boxShadow: [
            "0 20px 50px rgba(0, 0, 0, 0.1)",
            "0 25px 60px rgba(16, 185, 129, 0.15)",
            "0 20px 50px rgba(0, 0, 0, 0.1)"
          ]
        } : {}}
        transition={{ duration: 1.5 }}
      >
        {/* Padrão de fundo sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500" />
        </div>

        {/* Header do Card */}
        <div className="relative z-10 text-center mb-6">
          <motion.h3 
            className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌱 Jardim Virtual
          </motion.h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cultive sua produtividade
          </p>
        </div>

        {/* Área principal do vaso */}
        <div className="relative flex items-center justify-center mb-8">
          <motion.div
            className="relative cursor-pointer"
            animate={isActive ? { 
              scale: [1, 1.02, 1],
              filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
            } : { scale: breathingScale }}
            transition={{ duration: 4, repeat: Infinity }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Base do vaso com sombra realista */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <motion.div 
                className="text-7xl relative z-10"
                style={{
                  filter: `drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))`
                }}
              >
                🪴
              </motion.div>
              
              {/* Solo dentro do vaso */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-amber-800/20 rounded-full blur-sm" />
              
              {/* Conteúdo crescendo do vaso */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage}
                  initial={{ scale: 0, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: -15 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20,
                    duration: 1.2 
                  }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  {getFlowerForStage()}
                </motion.div>
              </AnimatePresence>

              {/* Círculo de energia quando ativo */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Barra de progresso mágica melhorada */}
        <div className="relative mb-6">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className={cn(
                "h-full rounded-full relative overflow-hidden",
                flowerType === 'legendary' && "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500",
                flowerType === 'rare' && "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
                flowerType === 'common' && "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Shimmer effect na barra */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <div className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}% crescido
          </div>
        </div>

        {/* Controles padronizados igual ao EnhancedTimerDisplay */}
        <div className="relative z-10 flex items-center justify-center space-x-4">
          {/* Botão de configurações */}
          {onOpenSettings && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={onOpenSettings}
                className="h-12 w-12 rounded-full border-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {/* Botão principal play/pause */}
          {(onStart || onPause) && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={isRunning ? onPause : onStart}
                className={cn(
                  "h-16 w-16 rounded-full text-white text-lg font-medium shadow-xl transition-all duration-300",
                  "bg-emerald-500 hover:bg-emerald-600",
                  "hover:shadow-2xl hover:shadow-emerald-500/25",
                  "relative overflow-hidden"
                )}
              >
                {/* Efeito de pulse quando rodando */}
                {isRunning && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                {isRunning ? (
                  <Pause className="h-6 w-6 relative z-10" />
                ) : (
                  <Play className="h-6 w-6 ml-1 relative z-10" />
                )}
              </Button>
            </motion.div>
          )}

          {/* Botão de reset */}
          {onReset && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={onReset}
                className="h-12 w-12 rounded-full border-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Partículas mágicas que sobem em espiral - inspiração Ghibli */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0, 
              opacity: 1,
              rotate: 0
            }}
            animate={{ 
              x: [0, particle.x * 0.3, particle.x], 
              y: [0, particle.y * 0.5, particle.y], 
              scale: [0, 1.2, 0.8, 0], 
              opacity: [1, 1, 0.7, 0],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 3 + particle.delay, 
              ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier ease-out suave
              delay: particle.delay
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-30"
            style={{
              color: particle.color
            }}
          >
            <motion.div
              animate={{
                filter: [
                  "blur(0px) brightness(1)",
                  "blur(1px) brightness(1.5)",
                  "blur(0px) brightness(1)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg"
            >
              ✨
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sparkles de marco - efeito celestial */}
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="text-5xl"
            >
              <Sparkles className="w-12 h-12 text-yellow-400 filter drop-shadow-lg" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animação final de conclusão - celebração */}
      <AnimatePresence>
        {isFullyGrown && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-25"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
                filter: [
                  "hue-rotate(0deg) brightness(1)",
                  "hue-rotate(180deg) brightness(1.3)",
                  "hue-rotate(360deg) brightness(1)"
                ]
              }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity },
                filter: { duration: 4, repeat: Infinity }
              }}
              className="text-7xl"
            >
              🌟
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Texto de estado melhorado com gradientes */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center w-full">
        {isPotEmpty && (
          <motion.p 
            className="text-sm text-gray-500 dark:text-gray-400 font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💫 Vaso esperando para crescer...
          </motion.p>
        )}
        {!isPotEmpty && !isFullyGrown && (
          <motion.p 
            className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
            animate={{ 
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌱 Sua flor está crescendo com amor...
          </motion.p>
        )}
        {isFullyGrown && (
          <motion.p 
            className="text-sm font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent"
            animate={{ 
              scale: [1, 1.1, 1],
              filter: [
                "drop-shadow(0px 0px 0px rgba(34, 197, 94, 0))",
                "drop-shadow(0px 0px 10px rgba(34, 197, 94, 0.6))",
                "drop-shadow(0px 0px 0px rgba(34, 197, 94, 0))"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🎉 Flor completamente crescida! Parabéns! 🎉
          </motion.p>
        )}
      </div>
    </div>
  );
};
