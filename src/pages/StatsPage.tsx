import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Filter,
  Download,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductivityChart, ComparisonChart, OverviewMetrics } from '@/components/charts';
import { useStats, useStatsProductivity, useStatsOverview } from '@/hooks/useStats';
import { Skeleton } from '@/components/ui/skeleton';

// ========== INTERFACES ==========

type PeriodOption = 'week' | 'month' | 'quarter' | 'year';

// ========== COMPONENTES AUXILIARES ==========

const LoadingCard = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ========== COMPONENTE PRINCIPAL ==========

export default function StatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('week');
  const [activeTab, setActiveTab] = useState('overview');

  // Hooks de dados
  const { 
    data: { summary, comparison }, 
    loading, 
    errors, 
    refresh,
    loadSummary 
  } = useStats();

  const { overview, isLoading: overviewLoading, refresh: refreshOverview } = useStatsOverview(true);
  
  const { 
    productivity, 
    isLoading: productivityLoading, 
    refresh: refreshProductivity 
  } = useStatsProductivity(selectedPeriod);

  // Handlers
  const handlePeriodChange = (value: PeriodOption) => {
    setSelectedPeriod(value);
  };

  const handleRefreshAll = async () => {
    await refresh();
    refreshOverview();
    refreshProductivity();
  };

  const handleExport = () => {
    // Implementar exportação de dados
    console.log('Exportando dados...');
  };

  return (
    <div className="h-full p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Estatísticas</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Análise detalhada da sua produtividade e padrões de trabalho
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button onClick={handleRefreshAll} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Controles de Filtro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Período:</span>
                </div>
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Semana</SelectItem>
                    <SelectItem value="month">Mês</SelectItem>
                    <SelectItem value="quarter">Trimestre</SelectItem>
                    <SelectItem value="year">Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {summary && (
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="w-3 h-3" />
                    {summary.totalTasksCompleted} tarefas concluídas
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {summary.averageProductivity}% produtividade
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs de Conteúdo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="productivity">Produtividade</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {overviewLoading ? (
              <LoadingCard title="Métricas Gerais" />
            ) : overview ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <OverviewMetrics data={overview} showComparison={true} />
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="text-muted-foreground">
                    Nenhum dado de overview disponível
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comparação Semanal */}
            {comparison && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ComparisonChart 
                  data={comparison} 
                  height={350}
                  title="Análise Comparativa Semanal"
                />
              </motion.div>
            )}
          </TabsContent>

          {/* Tab: Produtividade */}
          <TabsContent value="productivity" className="space-y-6">
            {productivityLoading ? (
              <LoadingCard title="Gráfico de Produtividade" />
            ) : productivity ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProductivityChart 
                  data={productivity.dailyData}
                  title={`Produtividade - ${selectedPeriod === 'week' ? 'Última Semana' : 
                                                  selectedPeriod === 'month' ? 'Último Mês' :
                                                  selectedPeriod === 'quarter' ? 'Último Trimestre' : 'Último Ano'}`}
                  type="area"
                  height={400}
                />
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="text-muted-foreground">
                    Nenhum dado de produtividade disponível para o período selecionado
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumo do Período */}
            {productivity?.summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Resumo do Período
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-orange-500 mb-1">
                          {productivity.summary.totalPomodoros}
                        </div>
                        <div className="text-sm text-muted-foreground">Pomodoros</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-green-500 mb-1">
                          {productivity.summary.totalTasksCompleted}
                        </div>
                        <div className="text-sm text-muted-foreground">Tarefas</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-blue-500 mb-1">
                          {Math.round(productivity.summary.totalFocusTime / 60)}h
                        </div>
                        <div className="text-sm text-muted-foreground">Tempo Focado</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-purple-500 mb-1">
                          {productivity.summary.averageProductivity}%
                        </div>
                        <div className="text-sm text-muted-foreground">Produtividade</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Tab: Análise */}
          <TabsContent value="analysis" className="space-y-6">
            {summary ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
              >
                {/* Estatísticas Históricas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Estatísticas Históricas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500 mb-2">
                          {summary.totalPomodoros}
                        </div>
                        <div className="text-sm text-muted-foreground">Total de Pomodoros</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500 mb-2">
                          {summary.totalTasksCompleted}
                        </div>
                        <div className="text-sm text-muted-foreground">Tarefas Concluídas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-500 mb-2">
                          {Math.round(summary.totalFocusTime / 60)}h
                        </div>
                        <div className="text-sm text-muted-foreground">Tempo Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-500 mb-2">
                          {summary.averageProductivity}%
                        </div>
                        <div className="text-sm text-muted-foreground">Produtividade Média</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-500 mb-2">
                          {summary.longestFocusStreak}
                        </div>
                        <div className="text-sm text-muted-foreground">Maior Sequência</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-pink-500 mb-2">
                          {summary.mostProductiveDay ? 
                            new Date(summary.mostProductiveDay).toLocaleDateString('pt-BR') : 
                            'N/A'
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">Dia Mais Produtivo</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Insights e Recomendações */}
                <Card>
                  <CardHeader>
                    <CardTitle>💡 Insights e Recomendações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
                        <div className="font-medium text-green-800 mb-1">Pontos Fortes</div>
                        <div className="text-sm text-green-700">
                          {summary.averageProductivity >= 70 
                            ? "Excelente consistência na produtividade!"
                            : "Boa base de trabalho estabelecida."
                          }
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                        <div className="font-medium text-blue-800 mb-1">Oportunidades</div>
                        <div className="text-sm text-blue-700">
                          {summary.longestFocusStreak < 7 
                            ? "Tente manter a consistência diária para criar hábitos mais fortes."
                            : "Continue mantendo sua excelente rotina de trabalho!"
                          }
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-500">
                        <div className="font-medium text-orange-800 mb-1">Próximos Passos</div>
                        <div className="text-sm text-orange-700">
                          Com base nos seus padrões, considere ajustar seus horários de maior produtividade.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="text-muted-foreground">
                    Carregando análise detalhada...
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 