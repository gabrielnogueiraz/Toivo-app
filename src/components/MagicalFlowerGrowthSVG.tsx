import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface MagicalFlowerGrowthProps {
  progress: number; // 0-100
  isActive: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  className?: string;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onOpenSettings?: () => void;
  isRunning?: boolean;
}

// Cores baseadas na prioridade da tarefa
const priorityColors = {
  LOW: '#A3BE8C',      // Verde Calmo
  MEDIUM: '#EBCB8B',   // Amarelo Quente  
  HIGH: '#BF616A'      // Vermelho Intenso
};

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
  priority = 'MEDIUM',
  className,
  onStart,
  onPause,
  onReset,
  onOpenSettings,
  isRunning = false
}: MagicalFlowerGrowthProps) => {
  const [particles, setParticles] = useState<MagicParticle[]>([]);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [breathingScale, setBreathingScale] = useState(1);

  const flowerColor = priorityColors[priority];
  const isPotEmpty = progress === 0;
  const isFullyGrown = progress >= 100;

  // Efeito de respiração suave para elementos vivos
  useEffect(() => {
    const breathingInterval = setInterval(() => {
      setBreathingScale(prev => prev === 1 ? 1.02 : 1);
    }, 3000);

    return () => clearInterval(breathingInterval);
  }, []);

  // Estágios do crescimento
  const getGrowthStage = (): 'empty' | 'sprout' | 'growing' | 'blooming' => {
    if (progress <= 25) return 'empty';
    if (progress <= 50) return 'sprout';
    if (progress <= 75) return 'growing';
    return 'blooming';
  };

  const growthStage = getGrowthStage();

  // Efeitos de partículas em marcos importantes
  useEffect(() => {
    if (progress > 0 && (progress % 25 === 0 || progress >= 100)) {
      setShowSparkles(true);
      setShowGlow(true);
      
      const particleCount = progress >= 100 ? 20 : 12;
      const newParticles: MagicParticle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        delay: i * 0.1,
        color: flowerColor
      }));
      
      setParticles(newParticles);
      
      setTimeout(() => {
        setShowSparkles(false);
        setShowGlow(false);
        setParticles([]);
      }, progress >= 100 ? 4000 : 2500);
    }
  }, [progress, flowerColor]);

  // Componente SVG da flor animada
  const AnimatedFlower = () => (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="absolute inset-0 z-20"
      style={{ transform: `scale(${breathingScale})` }}
    >
      {/* Solo dentro do vaso */}
      <motion.ellipse
        cx="60"
        cy="90"
        rx="25"
        ry="8"
        fill="#8B4513"
        opacity={0.3}
        animate={{
          opacity: progress > 0 ? 0.5 : 0.3
        }}
        transition={{ duration: 1 }}
      />

      {/* Broto - Aparece de 25% a 50% */}
      <AnimatePresence>
        {growthStage !== 'empty' && (
          <motion.g
            initial={{ opacity: 0, y: 20, scale: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotate: isActive ? [0, 2, -2, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 150, 
              damping: 12,
              duration: 1.5,
              rotate: { duration: 4, repeat: Infinity }
            }}
          >
            {/* Pequeno broto verde */}
            <motion.path
              d="M 55 85 Q 60 70 65 85"
              fill="none"
              stroke="#4A7C59"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: ['sprout', 'growing', 'blooming'].includes(growthStage) ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Folhinha do broto */}
            <motion.ellipse
              cx="60"
              cy="78"
              rx="4"
              ry="8"
              fill="#4A7C59"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: ['sprout', 'growing', 'blooming'].includes(growthStage) ? 1 : 0,
                opacity: ['sprout', 'growing', 'blooming'].includes(growthStage) ? 1 : 0
              }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Caule - Aparece de 50% a 75% */}
      <AnimatePresence>
        {(growthStage === 'growing' || growthStage === 'blooming') && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Caule principal */}
            <motion.path
              d="M 60 85 Q 58 60 60 40"
              fill="none"
              stroke="#4A7C59"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            
            {/* Folhas laterais */}
            <motion.path
              d="M 60 65 Q 45 62 50 55 Q 55 60 60 65"
              fill="#4A7C59"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            />
            
            <motion.path
              d="M 60 55 Q 75 52 70 45 Q 65 50 60 55"
              fill="#4A7C59"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Flor - Aparece de 75% a 100% */}
      <AnimatePresence>
        {growthStage === 'blooming' && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: isFullyGrown ? [0, 5, -5, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              duration: 2,
              rotate: { duration: 6, repeat: Infinity }
            }}
          >
            {/* Pétalas da flor */}
            {[0, 72, 144, 216, 288].map((rotation, index) => (
              <motion.ellipse
                key={index}
                cx="60"
                cy="30"
                rx="8"
                ry="15"
                fill={flowerColor}
                style={{
                  transformOrigin: '60px 40px',
                  transform: `rotate(${rotation}deg)`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 0.9,
                  filter: isFullyGrown ? [
                    "brightness(1)",
                    "brightness(1.2)",
                    "brightness(1)"
                  ] : "brightness(1)"
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 1,
                  filter: { duration: 3, repeat: Infinity }
                }}
              />
            ))}
            
            {/* Centro da flor */}
            <motion.circle
              cx="60"
              cy="40"
              r="6"
              fill="#FFD700"
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                filter: isFullyGrown ? [
                  "brightness(1) drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))",
                  "brightness(1.3) drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))",
                  "brightness(1) drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))"
                ] : "brightness(1)"
              }}
              transition={{ 
                delay: 0.6,
                duration: 1,
                filter: { duration: 2, repeat: Infinity }
              }}
            />

            {/* Halo de luz ao redor da flor quando completa */}
            {isFullyGrown && (
              <motion.circle
                cx="60"
                cy="40"
                r="25"
                fill="none"
                stroke={flowerColor}
                strokeWidth="2"
                strokeOpacity="0.3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.g>
        )}
      </AnimatePresence>

      {/* Efeito de brilho quando há mudança de estágio */}
      {showGlow && (
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={flowerColor}
          strokeWidth="1"
          strokeOpacity="0.2"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 2,
            opacity: [0, 0.5, 0]
          }}
          transition={{ duration: 2 }}
        />
      )}
    </svg>
  );

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
          showGlow && "shadow-lg"
        )}
        animate={showGlow ? {
          boxShadow: [
            "0 20px 50px rgba(0, 0, 0, 0.1)",
            `0 25px 60px ${flowerColor}15`,
            "0 20px 50px rgba(0, 0, 0, 0.1)"
          ]
        } : {}}
        transition={{ duration: 1.5 }}
      >
        {/* Padrão de fundo sutil */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-current to-current" 
            style={{ color: flowerColor }}
          />
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
              filter: ["brightness(1)", "brightness(1.05)", "brightness(1)"]
            } : { scale: breathingScale }}
            transition={{ duration: 4, repeat: Infinity }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Base do vaso com sombra realista */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <motion.div 
                className="text-8xl relative z-10"
                style={{
                  filter: `drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))`
                }}
              >
                🪴
              </motion.div>
              
              {/* Flor SVG animada */}
              <AnimatedFlower />

              {/* Círculo de energia quando ativo */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-opacity-30"
                  style={{ borderColor: flowerColor }}
                  animate={{ 
                    scale: [1, 1.2, 1],
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
              className="h-full rounded-full relative overflow-hidden"
              style={{ 
                background: `linear-gradient(90deg, ${flowerColor}80, ${flowerColor})`
              }}
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

        {/* Controles padronizados */}
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
                  "hover:shadow-2xl relative overflow-hidden"
                )}
                style={{ 
                  backgroundColor: flowerColor,
                  boxShadow: `0 10px 30px ${flowerColor}25`
                }}
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

      {/* Partículas mágicas que sobem em espiral */}
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
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: particle.delay
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-30"
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
              style={{ color: particle.color }}
            >
              ✨
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sparkles de marco */}
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
              <Sparkles 
                className="w-12 h-12 filter drop-shadow-lg" 
                style={{ color: flowerColor }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Texto de estado melhorado */}
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
            className="text-sm font-semibold"
            style={{ color: flowerColor }}
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
            className="text-sm font-bold"
            style={{ color: flowerColor }}
            animate={{ 
              scale: [1, 1.1, 1],
              filter: [
                "brightness(1)",
                "brightness(1.3)",
                "brightness(1)"
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
