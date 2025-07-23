import { motion } from 'framer-motion';
import { Crown, Star, Target, TrendingUp, Calendar, Flame, Zap, Sprout, Flower2 } from 'lucide-react';
import { FlowerStats, FLOWER_COLORS } from '../types/garden';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface FlowerStatsProps {
  stats: FlowerStats;
}

export const FlowerStatsComponent = ({ stats }: FlowerStatsProps) => {
  const totalFlowers = stats.totalFlowers;
  const legendaryPercentage = totalFlowers > 0 ? (stats.legendaryFlowers / totalFlowers) * 100 : 0;
  
  const priorityStats = [
    { priority: 'HIGH', count: stats.flowersByPriority?.HIGH || 0, color: FLOWER_COLORS.HIGH, icon: Flame },
    { priority: 'MEDIUM', count: stats.flowersByPriority?.MEDIUM || 0, color: FLOWER_COLORS.MEDIUM, icon: Zap },
    { priority: 'LOW', count: stats.flowersByPriority?.LOW || 0, color: FLOWER_COLORS.LOW, icon: Sprout },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {/* Total de Flores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Total de Flores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground mb-3">
              {totalFlowers}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Normais</span>
                <span className="text-sm font-semibold text-card-foreground">{stats.normalFlowers}</span>
              </div>
              {stats.legendaryFlowers > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Lendárias
                  </span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {stats.legendaryFlowers}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
          
          {/* Efeito visual */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
        </Card>
      </motion.div>

      {/* Flores por Prioridade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="relative overflow-hidden h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Por Prioridade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityStats.map((item, index) => (
                <motion.div
                  key={item.priority}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-card-foreground">
                        {item.priority.toLowerCase()}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: item.color }}>
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: totalFlowers > 0 ? `${(item.count / totalFlowers) * 100}%` : '0%' 
                        }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Produtividade do Jardim */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="relative overflow-hidden h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Produtividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sequência</span>
                <span className="text-lg font-bold text-green-600">{stats.completionStreak}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">% Lendárias</span>
                <span className="text-sm font-semibold text-amber-600">
                  {legendaryPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Este mês</span>
                <span className="text-sm font-semibold text-card-foreground">
                  {stats.flowersByMonth?.slice(-1)[0]?.count || 0}
                </span>
              </div>
              {stats.favoriteFlower && (
                <div className="pt-2 border-t border-muted">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${FLOWER_COLORS[stats.favoriteFlower.priority]}20`,
                        border: `1px solid ${FLOWER_COLORS[stats.favoriteFlower.priority]}`
                      }}
                    >
                      {stats.favoriteFlower.type === 'legendary' ? (
                        <div className="relative">
                          <Flower2 className="w-4 h-4 text-amber-500" />
                          <Crown className="w-2 h-2 text-amber-500 absolute -top-0.5 -right-0.5" />
                        </div>
                      ) : (
                        <Flower2 className="w-4 h-4 text-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-card-foreground truncate">
                        {stats.favoriteFlower.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Flor favorita
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          {/* Efeito visual */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full" />
        </Card>
      </motion.div>
    </div>
  );
};
