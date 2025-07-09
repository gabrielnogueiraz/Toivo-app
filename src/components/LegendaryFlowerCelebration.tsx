import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface LegendaryFlowerCelebrationProps {
  isVisible: boolean;
  onComplete: () => void;
  flowerName?: string;
  flowerCount?: number;
}

const legendaryFlowers = [
  { name: 'Flor da Coragem', emoji: '🌹', color: 'from-red-500 to-pink-500' },
  { name: 'Flor Rubra do Foco Total', emoji: '🥀', color: 'from-purple-500 to-red-500' },
  { name: 'Rosa da Constância', emoji: '🌺', color: 'from-pink-500 to-rose-500' },
  { name: 'Flor Lendária', emoji: '🌟', color: 'from-yellow-500 to-orange-500' }
];

export const LegendaryFlowerCelebration = ({ 
  isVisible, 
  onComplete, 
  flowerName = 'Flor Lendária',
  flowerCount = 1 
}: LegendaryFlowerCelebrationProps) => {
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const flower = legendaryFlowers.find(f => f.name === flowerName) || legendaryFlowers[3];

  useEffect(() => {
    if (isVisible) {
      setStage(0);
      
      // Gerar partículas mágicas
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);

      // Sequência de animação
      const sequence = [
        { stage: 1, delay: 500 },   // Entrada dramática
        { stage: 2, delay: 1500 },  // Revelação da flor
        { stage: 3, delay: 3000 },  // Celebração
        { stage: 4, delay: 5000 },  // Finalização
      ];

      sequence.forEach(({ stage, delay }) => {
        setTimeout(() => setStage(stage), delay);
      });

      // Auto-complete após 6 segundos
      setTimeout(() => {
        onComplete();
      }, 6000);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(45deg, #0f0f23, #1a1a2e, #16213e, #0f0f23)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 3s ease infinite'
          }}
        >
          {/* Partículas mágicas de fundo */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: particle.x, 
                y: particle.y,
                scale: 0,
                opacity: 0
              }}
              animate={{
                y: particle.y - 200,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 3,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            />
          ))}

          {/* Círculos de energia */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: stage >= 1 ? [1, 3, 1] : 0,
              opacity: stage >= 1 ? [0.3, 0.1, 0.3] : 0
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn(
              "absolute w-96 h-96 rounded-full border-4",
              `bg-gradient-to-r ${flower.color} opacity-20`
            )}
          />

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: stage >= 1 ? [1, 2, 1] : 0,
              opacity: stage >= 1 ? [0.5, 0.2, 0.5] : 0
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className={cn(
              "absolute w-64 h-64 rounded-full border-4",
              `bg-gradient-to-r ${flower.color} opacity-30`
            )}
          />

          {/* Conteúdo principal */}
          <div className="relative text-center text-white z-10">
            {/* Título dramático */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ 
                y: stage >= 1 ? 0 : -100,
                opacity: stage >= 1 ? 1 : 0
              }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 10,
                delay: 0.3
              }}
              className="mb-8"
            >
              <motion.h1 
                className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
                animate={{ 
                  scale: stage >= 3 ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ✨ LENDÁRIO! ✨
              </motion.h1>
              <motion.p 
                className="text-2xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: stage >= 2 ? 1 : 0 }}
                transition={{ delay: 1 }}
              >
                Você desbloqueou uma flor lendária!
              </motion.p>
            </motion.div>

            {/* Flor gigante */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: stage >= 2 ? 1 : 0,
                rotate: stage >= 2 ? 0 : -180
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 1.2
              }}
              className="text-9xl mb-6 filter drop-shadow-2xl"
            >
              {flower.emoji}
            </motion.div>

            {/* Nome da flor */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{
                y: stage >= 2 ? 0 : 50,
                opacity: stage >= 2 ? 1 : 0
              }}
              transition={{ delay: 1.8 }}
              className="mb-6"
            >
              <h2 className="text-4xl font-bold text-white mb-2">
                {flower.name}
              </h2>
              {flowerCount > 1 && (
                <p className="text-xl text-gray-300">
                  {flowerCount} flores lendárias!
                </p>
              )}
            </motion.div>

            {/* Efeitos de celebração */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 3 ? 1 : 0 }}
              transition={{ delay: 2.5 }}
              className="flex justify-center items-center space-x-8"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-4xl"
                >
                  {i % 2 === 0 ? '⭐' : '✨'}
                </motion.div>
              ))}
            </motion.div>

            {/* Mensagem de conquista */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{
                y: stage >= 3 ? 0 : 30,
                opacity: stage >= 3 ? 1 : 0
              }}
              transition={{ delay: 2.8 }}
              className="mt-8"
            >
              <p className="text-lg text-gray-300 max-w-md mx-auto">
                Sua dedicação e foco extraordinários foram recompensados com esta conquista rara e especial!
              </p>
            </motion.div>

            {/* Botão para continuar */}
            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{
                y: stage >= 4 ? 0 : 30,
                opacity: stage >= 4 ? 1 : 0
              }}
              onClick={onComplete}
              className={cn(
                "mt-8 px-8 py-3 rounded-full text-lg font-semibold",
                "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                "hover:from-purple-600 hover:to-pink-600 transition-all",
                "transform hover:scale-105 shadow-xl"
              )}
            >
              Continuar a Jornada ✨
            </motion.button>
          </div>

          {/* Click overlay para fechar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 4 ? 0.1 : 0 }}
            onClick={onComplete}
            className="absolute inset-0 cursor-pointer"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
