import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Timer, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Clock,
  CheckCircle2,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight
} from 'lucide-react';
import { OverviewStats, formatFocusTime } from '@/services/statsService';

// ========== INTERFACES ==========

interface OverviewMetricsProps {
  data: OverviewStats;
  className?: string;
  showComparison?: boolean;
}

interface MetricCardProps {
  title: string;
  icon: React.ElementType;
  today: number;
  week: number;
  month: number;
  unit?: string;
  formatter?: (value: number) => string;
  color?: string;
  delay?: number;
}

// ========== HELPER COMPONENTS ==========

const MetricCard = memo<MetricCardProps>(({ 
  title, 
  icon: Icon, 
  today, 
  week, 
  month, 
  unit = '',
  formatter,
  color = 'text-primary',
  delay = 0
}) => {
  const formatValue = (value: number) => {
    if (formatter) return formatter(value);
    return `${value}${unit}`;
  };

  const weekTrend = week > 0 ? ((today * 7 - week) / week) * 100 : 0;
  const getTrendColor = (trend: number) => {
    if (Math.abs(trend) < 5) return 'text-muted-foreground';
    return trend > 0 ? 'text-green-500' : 'text-red-500';
  };

  const getTrendIcon = (trend: number) => {
    if (Math.abs(trend) < 5) return Minus;
    return trend > 0 ? ArrowUp : ArrowDown;
  };

  const TrendIcon = getTrendIcon(weekTrend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {/* Valor principal (hoje) */}
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-foreground">
                {formatValue(today)}
              </div>
              {weekTrend !== 0 && (
                <div className={`flex items-center text-xs ${getTrendColor(weekTrend)}`}>
                  <TrendIcon className="w-3 h-3 mr-1" />
                  <span>{Math.abs(Math.round(weekTrend))}%</span>
                </div>
              )}
            </div>
            
            {/* Métricas por período */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Semana:</span>
                <span className="font-medium text-foreground">{formatValue(week)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mês:</span>
                <span className="font-medium text-foreground">{formatValue(month)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Barra de progresso visual */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((today / (week / 7 || 1)) * 100, 100)}%` }}
            transition={{ delay: delay + 0.3, duration: 0.8 }}
            className={`h-full ${color.replace('text-', 'bg-')}`}
          />
        </div>
      </Card>
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';

// ========== MAIN COMPONENT ==========

export const OverviewMetrics = memo<OverviewMetricsProps>(({
  data,
  className = "",
  showComparison = true
}) => {
  const navigate = useNavigate();
  const metrics = [
    {
      title: "Pomodoros Hoje",
      icon: Timer,
      today: data.pomodoros.today,
      week: data.pomodoros.week,
      month: data.pomodoros.month,
      color: "text-orange-500",
      delay: 0.1
    },
    {
      title: "Tarefas Concluídas",
      icon: CheckCircle2,
      today: data.tasksCompleted.today,
      week: data.tasksCompleted.week,
      month: data.tasksCompleted.month,
      color: "text-green-500",
      delay: 0.2
    },
    {
      title: "Tempo Focado",
      icon: Clock,
      today: data.focusTime.today,
      week: data.focusTime.week,
      month: data.focusTime.month,
      formatter: formatFocusTime,
      color: "text-blue-500",
      delay: 0.3
    },
    {
      title: "Produtividade",
      icon: Activity,
      today: data.productivity.today,
      week: data.productivity.week,
      month: data.productivity.month,
      unit: "%",
      color: "text-purple-500",
      delay: 0.4
    }
  ];

  // Calcular estatísticas gerais
  const totalPomodorosWeek = data.pomodoros.week;
  const totalTasksWeek = data.tasksCompleted.week;
  const avgProductivityWeek = data.productivity.week;
  const totalFocusTimeWeek = data.focusTime.week;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Grid de métricas principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Resumo semanal */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Resumo da Semana
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/stats')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Total de Pomodoros</div>
                  <div className="text-xl font-bold text-orange-500">{totalPomodorosWeek}</div>
                  <div className="text-xs text-muted-foreground">
                    ~{formatFocusTime(totalPomodorosWeek * 25)}
                  </div>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Tarefas Finalizadas</div>
                  <div className="text-xl font-bold text-green-500">{totalTasksWeek}</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(totalTasksWeek / 7)} por dia
                  </div>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Tempo Total</div>
                  <div className="text-xl font-bold text-blue-500">
                    {formatFocusTime(totalFocusTimeWeek)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFocusTime(Math.round(totalFocusTimeWeek / 7))} por dia
                  </div>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <div className="text-sm text-muted-foreground mb-1">Produtividade Média</div>
                  <div className="text-xl font-bold text-purple-500">{avgProductivityWeek}%</div>
                  <div className="text-xs text-muted-foreground">
                    <Badge variant={avgProductivityWeek >= 70 ? "default" : "secondary"} className="text-xs">
                      {avgProductivityWeek >= 80 ? "Excelente" : 
                       avgProductivityWeek >= 70 ? "Bom" : 
                       avgProductivityWeek >= 50 ? "Regular" : "Baixo"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Insights rápidos */}
              <div className="mt-4 p-3 rounded-lg bg-background/30 border-l-4 border-primary">
                <div className="text-sm font-medium text-foreground mb-1">💡 Insight da Semana</div>
                <div className="text-xs text-muted-foreground">
                  {avgProductivityWeek >= 80 
                    ? "Parabéns! Você teve uma semana muito produtiva. Continue assim!"
                    : avgProductivityWeek >= 70 
                    ? "Boa semana! Tente manter a consistência nos próximos dias."
                    : avgProductivityWeek >= 50 
                    ? "Semana regular. Que tal tentar focar em sessões mais curtas?"
                    : "Semana desafiadora. Lembre-se: pequenos passos ainda são progresso!"
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
});

OverviewMetrics.displayName = 'OverviewMetrics';

export default OverviewMetrics; 