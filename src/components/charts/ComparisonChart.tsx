import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart3, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { ComparisonStats } from '@/services/statsService';

// ========== INTERFACES ==========

interface ComparisonChartProps {
  data: ComparisonStats;
  title?: string;
  showGrid?: boolean;
  height?: number;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// ========== HELPER COMPONENTS ==========

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const currentValue = payload.find(p => p.dataKey === 'current')?.value || 0;
  const previousValue = payload.find(p => p.dataKey === 'previous')?.value || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? Math.round((change / previousValue) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg"
    >
      <div className="text-sm font-medium mb-2 text-foreground">
        {label}
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Semana Atual</span>
          </div>
          <span className="font-medium text-foreground">{currentValue}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            <span className="text-muted-foreground">Semana Anterior</span>
          </div>
          <span className="font-medium text-foreground">{previousValue}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {change >= 0 ? (
                <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span className="text-muted-foreground">Diferença</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}
              </span>
              <span className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({changePercent >= 0 ? '+' : ''}{changePercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========

export const ComparisonChart = memo<ComparisonChartProps>(({
  data,
  title = "Comparação Semanal",
  showGrid = true,
  height = 300,
  className = ""
}) => {
  const navigate = useNavigate();
  
  // Transformar dados para o gráfico
  const chartData = [
    {
      name: 'Pomodoros',
      current: data.pomodoros.current,
      previous: data.pomodoros.previous,
      change: data.pomodoros.change,
      changePercent: data.pomodoros.changePercent
    },
    {
      name: 'Tarefas',
      current: data.tasksCompleted.current,
      previous: data.tasksCompleted.previous,
      change: data.tasksCompleted.change,
      changePercent: data.tasksCompleted.changePercent
    },
    {
      name: 'Produtividade',
      current: data.productivity.current,
      previous: data.productivity.previous,
      change: data.productivity.change,
      changePercent: data.productivity.changePercent
    }
  ];

  // Calcular tendência geral
  const overallTrend = chartData.reduce((sum, item) => sum + item.changePercent, 0) / chartData.length;

  const chartColor = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--muted-foreground))',
    background: 'hsl(var(--background))',
    muted: 'hsl(var(--muted))'
  };

  // Cores para as barras baseadas na performance
  const getBarColor = (changePercent: number) => {
    if (changePercent > 10) return '#22c55e'; // verde forte
    if (changePercent > 0) return '#84cc16'; // verde claro
    if (changePercent > -10) return '#f59e0b'; // amarelo
    return '#ef4444'; // vermelho
  };

  return (
    <Card className={`h-fit ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={overallTrend >= 0 ? "default" : "secondary"} className="text-xs">
              {overallTrend >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(Math.round(overallTrend))}%
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/stats')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Resumo das métricas */}
        <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
          {chartData.map((item) => (
            <div key={item.name} className="text-center p-2 rounded-lg bg-muted/50">
              <div className="font-medium text-muted-foreground mb-1">{item.name}</div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-semibold text-foreground">{item.current}</span>
                <div className={`flex items-center text-xs ${
                  item.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.changePercent >= 0 ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(item.changePercent)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ height }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
            >
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={chartColor.muted}
                  opacity={0.3}
                />
              )}
              
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 11, fill: chartColor.secondary }}
                axisLine={false}
                tickLine={false}
              />
              
              <YAxis 
                tick={{ fontSize: 11, fill: chartColor.secondary }}
                axisLine={false}
                tickLine={false}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Barras da semana atual */}
              <Bar 
                dataKey="current" 
                radius={[4, 4, 0, 0]}
                opacity={0.9}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`current-${index}`} 
                    fill={getBarColor(entry.changePercent)}
                  />
                ))}
              </Bar>
              
              {/* Barras da semana anterior (com opacidade reduzida) */}
              <Bar 
                dataKey="previous" 
                radius={[2, 2, 0, 0]}
                opacity={0.4}
                fill={chartColor.secondary}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Legenda personalizada */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary opacity-90" />
            <span className="text-muted-foreground">Semana Atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted-foreground opacity-40" />
            <span className="text-muted-foreground">Semana Anterior</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ComparisonChart.displayName = 'ComparisonChart';

export default ComparisonChart; 