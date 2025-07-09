import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown } from 'lucide-react';
import { Flower, FLOWER_COLORS } from '../types/garden';
import { useGardenStore } from '../stores/gardenStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const RecentFlowersWidget = () => {
  const { flowers, fetchFlowers } = useGardenStore();
  const [recentFlowers, setRecentFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    fetchFlowers();
  }, [fetchFlowers]);

  useEffect(() => {
    // Pegar as 3 flores mais recentes
    const recent = flowers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    setRecentFlowers(recent);
  }, [flowers]);

  if (flowers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            🌸 Jardim Virtual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🌱</div>
            <p className="text-gray-600 mb-4">
              Complete suas primeiras tarefas para ver flores florescerem!
            </p>
            <Link to="/pomodoro">
              <Button size="sm">
                Começar Pomodoro
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            🌸 Jardim Virtual
          </span>
          <Link to="/garden">
            <Button variant="ghost" size="sm">
              Ver tudo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentFlowers.map((flower, index) => {
            const isLegendary = flower.type === 'legendary';
            const flowerColor = FLOWER_COLORS[flower.priority];
            
            return (
              <motion.div
                key={flower.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg relative
                    ${isLegendary ? 'bg-gradient-to-br from-amber-200 to-yellow-200' : 'bg-gray-100'}
                  `}
                  style={{
                    backgroundColor: isLegendary ? undefined : `${flowerColor}20`,
                    border: `2px solid ${flowerColor}`
                  }}
                >
                  {isLegendary ? '🌹' : '🌸'}
                  {isLegendary && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {flower.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: flowerColor, color: flowerColor }}
                    >
                      {flower.priority.toLowerCase()}
                    </Badge>
                    {isLegendary && (
                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                        Lendária
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {flowers.length > 3 && (
          <div className="mt-4 pt-3 border-t">
            <Link to="/garden">
              <Button variant="outline" size="sm" className="w-full">
                Ver todas as {flowers.length} flores
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
