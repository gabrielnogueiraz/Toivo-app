import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Sprout, Flower2 } from 'lucide-react';
import { Priority, FLOWER_COLORS } from '../types/garden';

interface MagicalFlowerGrowthProps {
  progress: number; // 0-100 - progresso do pomodoro
  isActive: boolean;
  priority?: Priority;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
  isLegendary?: boolean;
}

interface FloatingParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

const sizes = {
  sm: { width: 240, height: 300, scale: 0.8 },
  md: { width: 320, height: 380, scale: 1 },
  lg: { width: 400, height: 460, scale: 1.2 }
};

export const MagicalFlowerGrowth = ({
  progress,
  isActive,
  priority = 'MEDIUM',
  className = '',
  size = 'md',
  showControls = false,
  isLegendary = false,
}: MagicalFlowerGrowthProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const stemAnimation = useAnimation();
  const leavesAnimation = useAnimation();
  const budAnimation = useAnimation();
  const flowerAnimation = useAnimation();
  
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [isBreathing, setIsBreathing] = useState(false);

  const dimensions = sizes[size];
  const flowerColor = FLOWER_COLORS[priority];
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const potY = centerY + 80 * dimensions.scale;

  // Estágios do crescimento baseados no progresso
  const getGrowthStage = (): number => {
    if (progress <= 0) return 0;
    if (progress <= 20) return 1; // semente
    if (progress <= 40) return 2; // broto
    if (progress <= 60) return 3; // caule e folhas
    if (progress <= 80) return 4; // botão
    return 5; // flor completa
  };

  const growthStage = getGrowthStage();

  // Gerar partículas sutis
  useEffect(() => {
    if (isActive && growthStage > 0) {
      const generateParticles = () => {
        const newParticles: FloatingParticle[] = [];
        const particleCount = isLegendary ? 8 : 4;
        
        for (let i = 0; i < particleCount; i++) {
          newParticles.push({
            id: `particle-${i}-${Date.now()}`,
            x: centerX + (Math.random() - 0.5) * 60,
            y: potY - Math.random() * 100,
            size: 1 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.4,
            speed: 0.3 + Math.random() * 0.7,
            color: isLegendary ? '#fbbf24' : flowerColor,
          });
        }
        
        setParticles(newParticles);
      };

      generateParticles();
      const interval = setInterval(generateParticles, 3000);
      return () => clearInterval(interval);
    }
  }, [isActive, growthStage, centerX, potY, flowerColor, isLegendary]);

  // Respiração da flor quando completa
  useEffect(() => {
    if (growthStage >= 5 && isActive) {
      setIsBreathing(true);
    } else {
      setIsBreathing(false);
    }
  }, [growthStage, isActive]);

  // Animações dos estágios
  useEffect(() => {
    if (growthStage >= 2) {
      stemAnimation.start({
        scaleY: Math.min(progress / 60, 1),
        opacity: 1,
        transition: { duration: 1.5, ease: "easeOut" }
      });
    }

    if (growthStage >= 3) {
      leavesAnimation.start({
        scale: Math.min((progress - 40) / 20, 1),
        opacity: 1,
        transition: { duration: 1.2, ease: "easeOut" }
      });
    }

    if (growthStage >= 4) {
      budAnimation.start({
        scale: Math.min((progress - 60) / 20, 1),
        opacity: 1,
        transition: { duration: 1, ease: "easeOut" }
      });
    }

    if (growthStage >= 5) {
      flowerAnimation.start({
        scale: Math.min((progress - 80) / 20, 1),
        opacity: 1,
        rotateZ: [0, 2, -2, 0],
        transition: { 
          scale: { duration: 1.8, ease: "easeOut" },
          opacity: { duration: 1.8, ease: "easeOut" },
          rotateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      });
    }
  }, [growthStage, progress, stemAnimation, leavesAnimation, budAnimation, flowerAnimation]);

  const getSeedState = () => {
    if (progress <= 5) return { scale: 0.6, y: 0, opacity: 0.4 };
    if (progress <= 15) return { scale: 0.8, y: -1, opacity: 0.6 };
    return { scale: 1, y: -2, opacity: 0.8 };
  };

  const getStatusMessage = () => {
    if (progress === 0) return { icon: Sprout, text: "Preparando terreno..." };
    if (progress <= 20) return { icon: Sprout, text: "Semente germinando" };
    if (progress <= 40) return { icon: Sprout, text: "Primeiras raízes" };
    if (progress <= 60) return { icon: Sprout, text: "Crescendo com amor" };
    if (progress <= 80) return { icon: Flower2, text: "Botão se formando" };
    if (progress < 100) return { icon: Flower2, text: "Quase florescendo..." };
    return { icon: Sparkles, text: "Flor conquistada!" };
  };

  const statusMessage = getStatusMessage();

  return (
    <div className={`relative ${className}`}>
      {/* Container principal - Design minimalista */}
      <motion.div
        className="relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          background: isActive 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 50%, rgba(241,245,249,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(248,250,252,0.8) 0%, rgba(241,245,249,0.8) 100%)',
        }}
        animate={{
          boxShadow: isActive 
            ? [`0 20px 40px ${flowerColor}15`, `0 25px 50px ${flowerColor}25`, `0 20px 40px ${flowerColor}15`]
            : '0 10px 30px rgba(0,0,0,0.1)',
          scale: isActive ? [1, 1.005, 1] : 1,
        }}
        transition={{ 
          boxShadow: { duration: 4, repeat: Infinity },
          scale: { duration: 3, repeat: Infinity }
        }}
      >
        {/* Gradiente sutil de fundo */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at center, ${flowerColor}40, transparent 70%)`
          }}
        />

        {/* Partículas flutuantes minimalistas */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: particle.x, 
                y: particle.y, 
                opacity: 0, 
                scale: 0 
              }}
              animate={{ 
                y: particle.y - 80,
                opacity: [0, particle.opacity, 0],
                scale: [0, 1, 0],
                x: particle.x + (Math.random() - 0.5) * 30,
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 4, 
                ease: "easeOut",
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </AnimatePresence>

        {/* SVG da planta - Design simplificado */}
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id="potGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8a29e" />
              <stop offset="100%" stopColor="#78716c" />
            </linearGradient>
          </defs>

          {/* Vaso moderno e minimalista */}
          <motion.path
            d={`M ${centerX - 35} ${potY - 30}
                L ${centerX - 32} ${potY + 15}
                Q ${centerX - 32} ${potY + 18} ${centerX - 29} ${potY + 18}
                L ${centerX + 29} ${potY + 18}
                Q ${centerX + 32} ${potY + 18} ${centerX + 32} ${potY + 15}
                L ${centerX + 35} ${potY - 30}
                Q ${centerX + 35} ${potY - 32} ${centerX + 32} ${potY - 32}
                L ${centerX - 32} ${potY - 32}
                Q ${centerX - 35} ${potY - 32} ${centerX - 35} ${potY - 30} Z`}
            fill="url(#potGradient)"
            stroke="#94a3b8"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Solo minimalista */}
          <motion.ellipse
            cx={centerX}
            cy={potY - 15}
            rx="30"
            ry="6"
            fill="url(#soilGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Semente (estágio 1) */}
          {growthStage >= 1 && (
            <motion.ellipse
              cx={centerX}
              cy={potY - 12}
              rx="2"
              ry="3"
              fill="#78716c"
              initial={{ scale: 0, opacity: 0 }}
              animate={getSeedState()}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}

          {/* Caule (estágio 2+) */}
          {growthStage >= 2 && (
            <motion.rect
              x={centerX - 1.5}
              y={potY - 12 - (progress * 1.2)}
              width="3"
              height={progress * 1.2}
              rx="1.5"
              fill="#22c55e"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={stemAnimation}
              style={{ transformOrigin: 'bottom' }}
            />
          )}

          {/* Folhas (estágio 3+) */}
          {growthStage >= 3 && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={leavesAnimation}
            >
              {/* Folha esquerda */}
              <motion.ellipse
                cx={centerX - 12}
                cy={potY - 25 - progress * 0.4}
                rx="6"
                ry="12"
                fill="#16a34a"
                animate={{
                  rotate: [0, -3, 3, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Folha direita */}
              <motion.ellipse
                cx={centerX + 12}
                cy={potY - 32 - progress * 0.3}
                rx="6"
                ry="12"
                fill="#16a34a"
                animate={{
                  rotate: [0, 3, -3, 0],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>
          )}

          {/* Botão (estágio 4+) */}
          {growthStage >= 4 && (
            <motion.ellipse
              cx={centerX}
              cy={potY - 12 - progress * 1.2}
              rx="4"
              ry="6"
              fill="#4ade80"
              initial={{ scale: 0, opacity: 0 }}
              animate={budAnimation}
            />
          )}

          {/* Flor (estágio 5) */}
          {growthStage >= 5 && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={flowerAnimation}
            >
              {/* Pétalas */}
              {[0, 72, 144, 216, 288].map((rotation, idx) => (
                <motion.ellipse
                  key={idx}
                  cx={centerX}
                  cy={potY - 12 - progress * 1.2}
                  rx="8"
                  ry="14"
                  fill={flowerColor}
                  opacity="0.95"
                  transform={`rotate(${rotation} ${centerX} ${potY - 12 - progress * 1.2})`}
                  animate={isBreathing ? {
                    scale: [1, 1.03, 1],
                    opacity: [0.95, 1, 0.95],
                  } : {}}
                  transition={{
                    duration: 3 + idx * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              
              {/* Centro da flor */}
              <motion.circle
                cx={centerX}
                cy={potY - 12 - progress * 1.2}
                r="5"
                fill="#fbbf24"
                animate={isBreathing ? {
                  scale: [1, 1.08, 1],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Aura sutil para flores lendárias */}
              {isLegendary && (
                <motion.circle
                  cx={centerX}
                  cy={potY - 12 - progress * 1.2}
                  r="18"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1"
                  opacity="0.3"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.g>
          )}
        </svg>

        {/* Indicador de estado sutil */}
        {isActive && (
          <motion.div
            className="absolute top-4 right-4"
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sun className="w-4 h-4 text-amber-400 opacity-60" />
          </motion.div>
        )}

        {isLegendary && (
          <motion.div
            className="absolute top-4 left-4"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </motion.div>
        )}

        {/* Barra de progresso elegante */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-black/5 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full rounded-full relative"
              style={{ 
                background: `linear-gradient(90deg, ${flowerColor}60, ${flowerColor})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Shimmer effect sutil */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          
          {/* Mensagem de status elegante */}
          <motion.div
            className="text-center mt-3 text-xs font-medium text-gray-600 dark:text-gray-300"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center justify-center gap-2">
              <statusMessage.icon className="w-3 h-3" />
              <span>{statusMessage.text}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
