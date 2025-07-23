import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { DailyProductivity } from '@/services/statsService';

// ========== INTERFACES ==========

interface ProductivityChartProps {
  data: DailyProductivity[];
  title?: string;
  type?: 'line' | 'area';
  showLegend?: boolean;
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

  const data = payload[0]?.payload;
  if (!data) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg"
    >
      <div className="text-sm font-medium mb-2 text-foreground">
        {formatDate(label || '')}
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Produtividade</span>
          </div>
          <span className="font-medium text-foreground">{data.productivity}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Pomodoros</span>
          </div>
          <span className="font-medium text-foreground">{data.pomodoros}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Tarefas</span>
          </div>
          <span className="font-medium text-foreground">{data.tasksCompleted}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Tempo</span>
          </div>
          <span className="font-medium text-foreground">{formatTime(data.focusTime)}</span>
        </div>
      </div>
    </motion.div>
  );
};

const formatXAxisLabel = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  } catch {
    return dateStr;
  }
};

// ========== MAIN COMPONENT ==========

export const ProductivityChart = memo<ProductivityChartProps>(({
  data,
  title = "Produtividade",
  type = 'area',
  showLegend = true,
  showGrid = true,
  height = 300,
  className = ""
}) => {
  // Calcular estatísticas
  const avgProductivity = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + item.productivity, 0) / data.length)
    : 0;

  const maxProductivity = Math.max(...data.map(item => item.productivity), 0);
  const trend = data.length > 1 
    ? data[data.length - 1].productivity - data[0].productivity
    : 0;

  const chartColor = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--muted-foreground))',
    background: 'hsl(var(--background))',
    muted: 'hsl(var(--muted))'
  };

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatXAxisLabel(item.date)
  }));

  return (
    <Card className={`h-fit ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={trend >= 0 ? "default" : "secondary"} className="text-xs">
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(trend)}%
            </Badge>
          </div>
        </div>
        
        {/* Métricas rápidas */}
        <div className="flex items-center gap-4 mt-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Média:</span>
            <span className="font-medium">{avgProductivity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Máximo:</span>
            <span className="font-medium">{maxProductivity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Dias:</span>
            <span className="font-medium">{data.length}</span>
          </div>
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
            {type === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor.primary} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                
                {showGrid && (
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={chartColor.muted}
                    opacity={0.3}
                  />
                )}
                
                <XAxis 
                  dataKey="formattedDate"
                  tick={{ fontSize: 11, fill: chartColor.secondary }}
                  axisLine={false}
                  tickLine={false}
                />
                
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: chartColor.secondary }}
                  axisLine={false}
                  tickLine={false}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey="productivity"
                  stroke={chartColor.primary}
                  strokeWidth={2}
                  fill="url(#productivityGradient)"
                  dot={{ fill: chartColor.primary, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, stroke: chartColor.primary, strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                {showGrid && (
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={chartColor.muted}
                    opacity={0.3}
                  />
                )}
                
                <XAxis 
                  dataKey="formattedDate"
                  tick={{ fontSize: 11, fill: chartColor.secondary }}
                  axisLine={false}
                  tickLine={false}
                />
                
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: chartColor.secondary }}
                  axisLine={false}
                  tickLine={false}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                {showLegend && (
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', color: chartColor.secondary }}
                  />
                )}
                
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke={chartColor.primary}
                  strokeWidth={2}
                  dot={{ fill: chartColor.primary, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, stroke: chartColor.primary, strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
});

ProductivityChart.displayName = 'ProductivityChart';

export default ProductivityChart; 