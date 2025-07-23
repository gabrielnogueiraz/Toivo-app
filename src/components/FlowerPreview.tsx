import { motion } from 'framer-motion';
import { Crown, Flower2, Sparkles } from 'lucide-react';
import { Priority, FLOWER_COLORS } from '../types/garden';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface FlowerPreviewProps {
  taskPriority: Priority;
  taskName: string;
  pomodorosCompleted: number;
  pomodorosTotal: number;
}

export const FlowerPreview = ({ 
  taskPriority, 
  taskName, 
  pomodorosCompleted, 
  pomodorosTotal 
}: FlowerPreviewProps) => {
  const flowerColor = FLOWER_COLORS[taskPriority];
  const progress = (pomodorosCompleted / pomodorosTotal) * 100;
  const isComplete = pomodorosCompleted >= pomodorosTotal;
  const isHighPriority = taskPriority === 'HIGH';

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Flower2 
            className={cn(
              "w-8 h-8",
              isHighPriority ? "text-amber-500" : "text-primary"
            )}
          />
          {isHighPriority && (
            <Crown className="w-4 h-4 text-amber-500 absolute -top-1 -right-1" />
          )}
          Recompensa da Tarefa
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="text-center">
          {/* Preview da flor */}
          <motion.div
            animate={{
              scale: isComplete ? [1, 1.1, 1] : 1,
              rotate: isComplete ? [0, 5, -5, 0] : 0
            }}
            transition={{
              duration: isComplete ? 0.6 : 0,
              repeat: isComplete ? 2 : 0
            }}
            className={`
              w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl transition-all duration-300
              ${isComplete 
                ? 'bg-gradient-to-br from-green-200 to-blue-200 shadow-lg' 
                : 'bg-gray-100 opacity-50'
              }
            `}
            style={{
              backgroundColor: isComplete 
                ? undefined 
                : `${flowerColor}10`,
              border: `3px ${isComplete ? 'solid' : 'dashed'} ${flowerColor}`,
            }}
          >
            {isComplete ? (
              isHighPriority ? '🌹' : '🌸'
            ) : (
              <span className="text-gray-400">🌱</span>
            )}
          </motion.div>

          {/* Status */}
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {isComplete ? (
                isHighPriority ? 'Flor Conquistada!' : 'Flor Conquistada!'
              ) : (
                'Flor em Crescimento...'
              )}
            </h4>
            
            <p className="text-xs text-gray-600 line-clamp-1">
              {taskName}
            </p>
          </div>

          {/* Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progresso</span>
              <span>{pomodorosCompleted}/{pomodorosTotal}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-2 rounded-full transition-colors duration-300"
                style={{ 
                  backgroundColor: isComplete ? flowerColor : `${flowerColor}60`
                }}
              />
            </div>
            
            <div className="flex justify-center gap-2 mt-3">
              <Badge
                variant="outline"
                className="text-xs"
                style={{ borderColor: flowerColor, color: flowerColor }}
              >
                {taskPriority.toLowerCase()}
              </Badge>
              
              {isHighPriority && (
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                  <Crown className="w-3 h-3 mr-1" />
                  Especial
                </Badge>
              )}
            </div>
          </div>

          {/* Dica motivacional */}
          {!isComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-gray-500 mt-3 italic"
            >
              {pomodorosTotal - pomodorosCompleted === 1 
                ? 'Mais 1 pomodoro para sua flor florescer!' 
                : `Faltam ${pomodorosTotal - pomodorosCompleted} pomodoros para sua flor florescer!`
              }
            </motion.p>
          )}
          
          {isComplete && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-green-600 mt-3 font-medium"
            >
              <div className="flex items-center gap-2 text-center">
                <Sparkles className="w-4 h-4" />
                <span>Parabéns! Sua flor foi adicionada ao jardim!</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </motion.p>
          )}
        </div>
      </CardContent>

      {/* Efeito de celebração para tarefas completas */}
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [1, 0.6, 0],
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
              className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
              style={{ backgroundColor: flowerColor }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
