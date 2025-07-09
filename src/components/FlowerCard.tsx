import { motion } from 'framer-motion';
import { Calendar, Crown, Tag } from 'lucide-react';
import { Flower, FLOWER_COLORS } from '../types/garden';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FlowerCardProps {
  flower: Flower;
  onClick: () => void;
  delay?: number;
}

export const FlowerCard = ({ flower, onClick, delay = 0 }: FlowerCardProps) => {
  const isLegendary = flower.type === 'legendary';
  const flowerColor = FLOWER_COLORS[flower.priority];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        duration: 0.6,
        delay,
        bounce: 0.3
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300
        hover:shadow-lg hover:shadow-opacity-20 bg-card border-border
        ${isLegendary 
          ? 'border-amber-300 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 hover:shadow-amber-200' 
          : 'hover:shadow-border'
        }
      `}>
        {/* Ícone de flor lendária */}
        {isLegendary && (
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg"
          >
            <Crown className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Flor visual */}
        <div className="flex justify-center mb-4">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center text-3xl
              ${isLegendary ? 'bg-gradient-to-br from-amber-200 to-yellow-200' : 'bg-muted'}
            `}
            style={{ 
              backgroundColor: isLegendary ? undefined : `${flowerColor}20`,
              border: `3px solid ${flowerColor}`
            }}
          >
            <span 
              style={{ 
                filter: isLegendary ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' : 'none'
              }}
            >
              {isLegendary ? '🌹' : '🌸'}
            </span>
          </motion.div>
        </div>

        {/* Nome da flor */}
        <h3 className={`
          text-lg font-semibold text-center mb-2 line-clamp-2
          ${isLegendary ? 'text-amber-900' : 'text-card-foreground'}
        `}>
          {flower.name}
        </h3>

        {/* Tags */}
        {flower.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 justify-center">
            {flower.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {flower.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{flower.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Informações */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(flower.createdAt), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>
          
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: flowerColor, color: flowerColor }}
            >
              {flower.priority.toLowerCase()}
            </Badge>
          </div>
        </div>

        {/* Efeito hover */}
        <motion.div
          className={`
            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
            ${isLegendary 
              ? 'bg-gradient-to-br from-amber-400/10 to-yellow-400/10' 
              : 'bg-gradient-to-br from-muted/20 to-muted/40'
            }
          `}
        />
      </div>
    </motion.div>
  );
};
