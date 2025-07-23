import { motion } from 'framer-motion';
import { BarChart3, Timer, TrendingUp, Target, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TasksCard } from '@/components/TasksCard';
import { OverviewMetrics, ComparisonChart } from '@/components/charts';
import { useStatsDashboard } from '@/hooks/useStats';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { overview, tasks, comparison, isLoading, error, refresh } = useStatsDashboard();

  // Componente de loading
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="touch-target">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Componente de erro
  const ErrorDisplay = () => (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          Erro ao carregar estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Visão geral da sua produtividade e progresso
            </p>
          </div>
          
          {!isLoading && (
            <Button 
              onClick={refresh} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          )}
        </div>
      </motion.div>

      {/* Seção de métricas principais */}
      {error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <ErrorDisplay />
        </motion.div>
      ) : isLoading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <LoadingSkeleton />
        </motion.div>
      ) : overview ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <OverviewMetrics data={overview} />
        </motion.div>
      ) : (
        // Fallback para casos onde não há dados ainda
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="touch-target">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Pomodoros Hoje
                </CardTitle>
                <Timer className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  carregando...
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="touch-target">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Tarefas Concluídas
                </CardTitle>
                <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  carregando...
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="touch-target">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Tempo Focado
                </CardTitle>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">0h</div>
                <p className="text-xs text-muted-foreground">
                  carregando...
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="touch-target">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Produtividade
                </CardTitle>
                <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">
                  carregando...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Grid com widgets adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
        {/* Card de Tarefas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TasksCard />
        </motion.div>

        {/* Gráfico de Comparação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {comparison ? (
            <ComparisonChart 
              data={comparison} 
              height={250}
              title="Progresso Semanal"
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  📊 Comparação Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-32 mx-auto" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : error ? (
                    <div>
                      <div className="text-4xl mb-2">⚠️</div>
                      <p className="text-gray-600 mb-4">
                        Erro ao carregar comparação
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-gray-600 mb-4">
                        Dados de comparação em breve
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>


    </div>
  );
}
