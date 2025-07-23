import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Flower2 } from 'lucide-react';
import { Flower, FLOWER_COLORS } from '../types/garden';
import { useGardenStore } from '../stores/gardenStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Sprout } from 'lucide-react';

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
            <Flower2 className="w-5 h-5 text-primary" />
            Jardim Virtual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Sprout className="w-12 h-12 mx-auto mb-2 text-primary" />
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
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flower2 className="w-5 h-5 text-primary" />
          Jardim Virtual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentFlowers.map((flower) => {
            const isLegendary = flower.type === 'legendary';
            return (
              <div
                key={flower.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Flower2 
                    className={cn(
                      "w-6 h-6",
                      isLegendary ? "text-amber-500" : "text-primary"
                    )}
                  />
                  {isLegendary && (
                    <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{flower.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(flower.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
