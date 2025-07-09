import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X } from 'lucide-react';
import { Flower, FLOWER_COLORS } from '../types/garden';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import useGardenRealtime from '../hooks/useGardenRealtime';
import { useGardenStore } from '../stores/gardenStore';

interface FlowerNotification {
  id: string;
  flower: Flower;
  timestamp: number;
}

export const FlowerNotificationSystem = () => {
  const [notifications, setNotifications] = useState<FlowerNotification[]>([]);
  const { flowers } = useGardenStore();
  
  // Escutar eventos de novas flores
  useGardenRealtime();

  // Detectar novas flores e criar notificações
  useEffect(() => {
    const checkForNewFlowers = () => {
      const now = Date.now();
      const recentFlowers = flowers.filter(flower => {
        const createdTime = new Date(flower.createdAt).getTime();
        return now - createdTime < 5000; // Flores criadas nos últimos 5 segundos
      });

      recentFlowers.forEach(flower => {
        // Verifica se já temos notificação para essa flor
        const existingNotification = notifications.find(n => n.flower.id === flower.id);
        if (!existingNotification) {
          const notification: FlowerNotification = {
            id: `flower-${flower.id}-${now}`,
            flower,
            timestamp: now
          };
          
          setNotifications(prev => [...prev, notification]);
          
          // Auto-remover após 8 segundos
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 8000);
        }
      });
    };

    checkForNewFlowers();
  }, [flowers, notifications]);

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => {
          const { flower } = notification;
          const isLegendary = flower.type === 'legendary';
          const flowerColor = FLOWER_COLORS[flower.priority];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{
                type: 'spring',
                duration: 0.6,
                bounce: 0.3
              }}
              className={`
                relative bg-white rounded-2xl p-4 shadow-lg border-2 backdrop-blur-sm
                ${isLegendary 
                  ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50' 
                  : 'border-green-200 bg-gradient-to-br from-green-50 to-blue-50'
                }
              `}
            >
              {/* Botão de fechar */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                onClick={() => removeNotification(notification.id)}
              >
                <X className="w-3 h-3" />
              </Button>

              {/* Conteúdo */}
              <div className="pr-6">
                <div className="flex items-center gap-3 mb-2">
                  {/* Ícone da flor */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-2xl relative
                      ${isLegendary ? 'bg-gradient-to-br from-amber-200 to-yellow-200' : 'bg-white'}
                    `}
                    style={{
                      backgroundColor: isLegendary ? undefined : `${flowerColor}20`,
                      border: `2px solid ${flowerColor}`
                    }}
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
                    >
                      {isLegendary ? '🌹' : '🌸'}
                    </motion.span>
                    
                    {/* Ícone lendário */}
                    {isLegendary && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center"
                      >
                        <Crown className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Texto */}
                  <div className="flex-1">
                    <motion.h4
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="font-semibold text-gray-900 text-sm"
                    >
                      {isLegendary ? '🎉 Flor Lendária!' : '✨ Nova Flor!'}
                    </motion.h4>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-700 text-xs mt-1 line-clamp-2"
                    >
                      {flower.name}
                    </motion.p>
                  </div>
                </div>

                {/* Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-2 flex-wrap"
                >
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: flowerColor, color: flowerColor }}
                  >
                    {flower.priority.toLowerCase()}
                  </Badge>
                  
                  {isLegendary && (
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                      <Crown className="w-3 h-3 mr-1" />
                      Lendária
                    </Badge>
                  )}
                </motion.div>
              </div>

              {/* Efeito de partículas para flores lendárias */}
              {isLegendary && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [1, 0.8, 0],
                        x: [0, (Math.random() - 0.5) * 100],
                        y: [0, (Math.random() - 0.5) * 100],
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.5 + i * 0.2,
                        ease: 'easeOut'
                      }}
                      className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
