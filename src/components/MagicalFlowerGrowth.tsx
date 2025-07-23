import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Sparkles, Droplets, Sun, Sprout, Flower2 } from 'lucide-react';
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

interface RainDrop {
  id: string;
  x: number;
  delay: number;
  duration: number;
}

const sizes = {
  sm: { width: 200, height: 200, scale: 0.7 },
  md: { width: 300, height: 300, scale: 1 },
  lg: { width: 400, height: 400, scale: 1.3 }
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
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const [isBreathing, setIsBreathing] = useState(false);

  const dimensions = sizes[size];
  const flowerColor = FLOWER_COLORS[priority];
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const potY = centerY + 60 * dimensions.scale;

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

  // Gerar partículas mágicas
  useEffect(() => {
    if (isActive && growthStage > 0) {
      const generateParticles = () => {
        const newParticles: FloatingParticle[] = [];
        const particleCount = isLegendary ? 15 : 8;
        
        for (let i = 0; i < particleCount; i++) {
          newParticles.push({
            id: `particle-${i}-${Date.now()}`,
            x: centerX + (Math.random() - 0.5) * 100,
            y: potY - Math.random() * 150,
            size: 2 + Math.random() * 3,
            opacity: 0.4 + Math.random() * 0.6,
            speed: 0.5 + Math.random() * 1,
            color: isLegendary ? '#fbbf24' : flowerColor,
          });
        }
        
        setParticles(newParticles);
      };

      generateParticles();
      const interval = setInterval(generateParticles, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive, growthStage, centerX, potY, flowerColor, isLegendary]);

  // Animação de "chuva" nutritiva ocasional
  useEffect(() => {
    if (isActive && Math.random() < 0.3) {
      const newDrops: RainDrop[] = [];
      for (let i = 0; i < 5; i++) {
        newDrops.push({
          id: `drop-${i}-${Date.now()}`,
          x: centerX + (Math.random() - 0.5) * 80,
          delay: Math.random() * 1,
          duration: 1 + Math.random() * 0.5,
        });
      }
      setRainDrops(newDrops);
      
      setTimeout(() => setRainDrops([]), 3000);
    }
  }, [progress, centerX, isActive]);

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
        transition: { duration: 1, ease: "easeOut" }
      });
    }

    if (growthStage >= 3) {
      leavesAnimation.start({
        scale: Math.min((progress - 40) / 20, 1),
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      });
    }

    if (growthStage >= 4) {
      budAnimation.start({
        scale: Math.min((progress - 60) / 20, 1),
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
      });
    }

    if (growthStage >= 5) {
      flowerAnimation.start({
        scale: Math.min((progress - 80) / 20, 1),
        opacity: 1,
        rotateZ: [0, 5, -5, 0],
        transition: { 
          scale: { duration: 1.2, ease: "easeOut" },
          opacity: { duration: 1.2, ease: "easeOut" },
          rotateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
      });
    }
  }, [growthStage, progress, stemAnimation, leavesAnimation, budAnimation, flowerAnimation]);

  const getSeedState = () => {
    if (progress <= 5) return { scale: 0.8, y: 0, opacity: 0.6 };
    if (progress <= 15) return { scale: 1, y: -2, opacity: 0.8 };
    return { scale: 1.1, y: -5, opacity: 1 };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Container principal */}
      <motion.div
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          background: isActive 
            ? 'linear-gradient(135deg, #e0f7fa 0%, #b2dfdb 50%, #80cbc4 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        }}
        animate={{
          boxShadow: isActive 
            ? ['0 4px 20px rgba(0,150,136,0.2)', '0 8px 30px rgba(0,150,136,0.4)', '0 4px 20px rgba(0,150,136,0.2)']
            : '0 2px 10px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Partículas mágicas flutuantes */}
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
                y: particle.y - 100,
                opacity: [0, particle.opacity, 0],
                scale: [0, 1, 0],
                x: particle.x + (Math.random() - 0.5) * 50,
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 3, 
                ease: "easeOut",
                opacity: { duration: 3 },
                scale: { duration: 3 },
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 10px ${particle.color}`,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Gotas de chuva nutritiva */}
        <AnimatePresence>
          {rainDrops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ x: drop.x, y: -10, scale: 0 }}
              animate={{ 
                y: potY,
                scale: [0, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: drop.duration,
                delay: drop.delay,
                ease: "easeIn" 
              }}
              className="absolute w-2 h-6 bg-blue-400 rounded-full opacity-60"
            />
          ))}
        </AnimatePresence>

        {/* SVG da planta */}
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="absolute inset-0"
        >
          {/* Solo e vaso */}
          <defs>
            <radialGradient id="soilGradient" cx="0.5" cy="0.3">
              <stop offset="0%" stopColor="#8B4513" />
              <stop offset="100%" stopColor="#654321" />
            </radialGradient>
            <linearGradient id="potGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D2691E" />
              <stop offset="100%" stopColor="#A0522D" />
            </linearGradient>
          </defs>

          {/* Vaso */}
          <path
            d={`M ${centerX - 50} ${potY - 40}
                L ${centerX - 45} ${potY + 20}
                Q ${centerX - 45} ${potY + 25} ${centerX - 40} ${potY + 25}
                L ${centerX + 40} ${potY + 25}
                Q ${centerX + 45} ${potY + 25} ${centerX + 45} ${potY + 20}
                L ${centerX + 50} ${potY - 40}
                Q ${centerX + 50} ${potY - 45} ${centerX + 45} ${potY - 45}
                L ${centerX - 45} ${potY - 45}
                Q ${centerX - 50} ${potY - 45} ${centerX - 50} ${potY - 40} Z`}
            fill="url(#potGradient)"
            stroke="#8B4513"
            strokeWidth="2"
          />

          {/* Solo */}
          <ellipse
            cx={centerX}
            cy={potY - 20}
            rx="45"
            ry="8"
            fill="url(#soilGradient)"
          />

          {/* Semente (estágio 1) */}
          {growthStage >= 1 && (
            <motion.ellipse
              cx={centerX}
              cy={potY - 15}
              rx="3"
              ry="5"
              fill="#8B4513"
              initial={{ scale: 0, opacity: 0 }}
              animate={getSeedState()}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}

          {/* Caule (estágio 2+) */}
          {growthStage >= 2 && (
            <motion.rect
              x={centerX - 2}
              y={potY - 15 - (progress * 1.5)}
              width="4"
              height={progress * 1.5}
              rx="2"
              fill="#228B22"
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
                cx={centerX - 15}
                cy={potY - 30 - progress * 0.5}
                rx="8"
                ry="15"
                fill="#32CD32"
                animate={{
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Folha direita */}
              <motion.ellipse
                cx={centerX + 15}
                cy={potY - 40 - progress * 0.4}
                rx="8"
                ry="15"
                fill="#32CD32"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>
          )}

          {/* Botão (estágio 4+) */}
          {growthStage >= 4 && (
            <motion.ellipse
              cx={centerX}
              cy={potY - 15 - progress * 1.5}
              rx="6"
              ry="8"
              fill="#90EE90"
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
                  cy={potY - 15 - progress * 1.5}
                  rx="12"
                  ry="20"
                  fill={flowerColor}
                  opacity="0.9"
                  transform={`rotate(${rotation} ${centerX} ${potY - 15 - progress * 1.5})`}
                  animate={isBreathing ? {
                    scale: [1, 1.05, 1],
                    opacity: [0.9, 1, 0.9],
                  } : {}}
                  transition={{
                    duration: 2 + idx * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              
              {/* Centro da flor */}
              <motion.circle
                cx={centerX}
                cy={potY - 15 - progress * 1.5}
                r="8"
                fill="#FFD700"
                animate={isBreathing ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Brilho para flores lendárias */}
              {isLegendary && (
                <motion.circle
                  cx={centerX}
                  cy={potY - 15 - progress * 1.5}
                  r="25"
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2"
                  opacity="0.6"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.2, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.g>
          )}
        </svg>

        {/* Indicadores de estado */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isActive && (
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Sun className="w-6 h-6 text-yellow-500" />
            </motion.div>
          )}
          
          {rainDrops.length > 0 && (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Droplets className="w-5 h-5 text-blue-500" />
            </motion.div>
          )}
          
          {isLegendary && (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
            </motion.div>
          )}
        </div>

        {/* Barra de progresso poética */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${flowerColor}, ${flowerColor}dd)`,
                boxShadow: `0 0 10px ${flowerColor}80`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          <motion.div
            className="text-center mt-2 text-sm font-medium text-gray-700"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {progress === 0 && (
              <div className="flex items-center justify-center gap-2">
                <Sprout className="w-4 h-4" />
                <span>Preparando para crescer...</span>
              </div>
            )}
            {progress > 0 && progress < 20 && (
              <div className="flex items-center justify-center gap-2">
                <Sprout className="w-4 h-4 rotate-180" />
                <span>Semente despertando...</span>
              </div>
            )}
            {progress >= 20 && progress < 40 && (
              <div className="flex items-center justify-center gap-2">
                <Sprout className="w-4 h-4" />
                <span>Primeiros brotos...</span>
              </div>
            )}
            {progress >= 40 && progress < 60 && (
              <div className="flex items-center justify-center gap-2">
                <Sprout className="w-4 h-4 scale-y-150" />
                <span>Caule fortalecendo...</span>
              </div>
            )}
            {progress >= 60 && progress < 80 && (
              <div className="flex items-center justify-center gap-2">
                <Flower2 className="w-4 h-4 opacity-50" />
                <span>Botão se formando...</span>
              </div>
            )}
            {progress >= 80 && progress < 100 && (
              <div className="flex items-center justify-center gap-2">
                <Flower2 className="w-4 h-4" />
                <span>Flor desabrochando...</span>
              </div>
            )}
            {progress >= 100 && (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Flor completa!</span>
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
