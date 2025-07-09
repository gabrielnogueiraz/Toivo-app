import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Calendar, Star } from 'lucide-react';
import { useGardenStore } from '../stores/gardenStore';
import { Badge } from './ui/badge';

export const GardenSummary = () => {
  const { stats, fetchStats } = useGardenStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchStats().then(() => setIsLoaded(true));
  }, [fetchStats]);

  if (!stats || !isLoaded) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
        <div className="w-4 h-4 border-2 border-green-300 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-green-700">Carregando jardim...</span>
      </div>
    );
  }

  const { totalFlowers, legendaryFlowers, completionStreak } = stats;

  if (totalFlowers === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg"
      >
        <span className="text-lg">🌱</span>
        <span className="text-sm text-blue-700">
          Seu jardim está aguardando a primeira flor!
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg"
    >
      <span className="text-lg">🌸</span>
      
      <div className="flex items-center gap-3 text-sm">
        {/* Total de flores */}
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-green-600" />
          <span className="font-medium text-green-800">
            {totalFlowers}
          </span>
          <span className="text-green-600">
            {totalFlowers === 1 ? 'flor' : 'flores'}
          </span>
        </div>

        {/* Flores lendárias */}
        {legendaryFlowers > 0 && (
          <>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-600" />
              <span className="font-medium text-amber-800">
                {legendaryFlowers}
              </span>
              <span className="text-amber-600">lendárias</span>
            </div>
          </>
        )}

        {/* Sequência */}
        {completionStreak > 0 && (
          <>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span className="font-medium text-blue-800">
                {completionStreak}
              </span>
              <span className="text-blue-600">
                {completionStreak === 1 ? 'dia' : 'dias'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Badge de nível baseado no total de flores */}
      {totalFlowers >= 5 && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {totalFlowers >= 50 ? '🏆 Mestre' : 
           totalFlowers >= 25 ? '💎 Expert' : 
           totalFlowers >= 10 ? '⭐ Avançado' : 
           '🌱 Jardineiro'}
        </Badge>
      )}
    </motion.div>
  );
};
