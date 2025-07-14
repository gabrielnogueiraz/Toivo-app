import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLumiContext } from '@/contexts/LumiContext';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  Clock, 
  TrendingUp, 
  User, 
  RefreshCw,
  ChevronRight,
  Archive,
  Lightbulb
} from 'lucide-react';
import { LumiMemory } from '@/types/lumi';

interface LumiSidebarProps {
  className?: string;
}

export const LumiSidebar: React.FC<LumiSidebarProps> = ({ className }) => {
  const {
    userContext,
    memories,
    insights,
    loading,
    refreshContext,
    refreshMemories,
    refreshInsights,
  } = useLumiContext();

  const [activeTab, setActiveTab] = useState<'context' | 'memories' | 'insights'>('context');

  const MemoryCard: React.FC<{ memory: LumiMemory }> = ({ memory }) => (
    <Card className="mb-2 sm:mb-3">
      <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-6">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          <Badge variant="outline" className="text-xs">
            {memory.type.replace('_', ' ')}
          </Badge>
          <Badge variant={memory.importance === 'HIGH' ? 'destructive' : 
                           memory.importance === 'MEDIUM' ? 'default' : 'secondary'}
                 className="text-xs">
            {memory.importance}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 p-3 sm:p-6">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
          {memory.content}
        </p>
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {memory.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {memory.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{memory.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={cn(
      'w-full sm:w-80 border-l bg-muted/30 flex flex-col',
      className
    )}>
      {/* Header */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold">Contexto</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refreshContext();
              refreshMemories();
              refreshInsights();
            }}
            disabled={loading}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <RefreshCw className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mx-3 sm:mx-4 mt-3 sm:mt-4">
            <TabsTrigger value="context" className="text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Perfil</span>
              <span className="sm:hidden">P</span>
            </TabsTrigger>
            <TabsTrigger value="memories" className="text-xs sm:text-sm">
              <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Memórias</span>
              <span className="sm:hidden">M</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs sm:text-sm">
              <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Insights</span>
              <span className="sm:hidden">I</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-3 sm:p-4 pt-2">{/* ...existing code... */}
            {/* User Context */}
            <TabsContent value="context" className="mt-3 sm:mt-4">
              <ScrollArea className="h-[calc(100vh-14rem)] sm:h-[calc(100vh-16rem)]">
                {userContext && userContext.user ? (
                  <div className="space-y-3 sm:space-y-4">
                    {/* User Info */}
                    <Card>
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle className="text-sm sm:text-base">
                          {userContext.user.name || 'Usuário sem nome'}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          ID: {userContext.user.id || 'ID não disponível'}
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Atividade Recente</span>
                          <span className="sm:hidden">Atividade</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6 pt-0">
                        {userContext.recentActivity && userContext.recentActivity.length > 0 ? (
                          <div className="space-y-2 sm:space-y-3">
                            {userContext.recentActivity.slice(0, 5).map((activity, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium line-clamp-2">
                                    {activity.type || 'Tipo não especificado'}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {activity.description || 'Sem descrição'}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {activity.timestamp ? new Date(activity.timestamp).toLocaleString('pt-BR') : 'Data não disponível'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Nenhuma atividade recente
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Current Tasks */}
                    <Card>
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Tarefas Atuais</span>
                          <span className="sm:hidden">Tarefas</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6 pt-0">
                        {userContext.currentTasks && userContext.currentTasks.length > 0 ? (
                          <div className="space-y-1.5 sm:space-y-2">
                            {userContext.currentTasks.slice(0, 5).map((task, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className={cn(
                                  'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full',
                                  task.completed ? 'bg-green-500' : 'bg-yellow-500'
                                )}></div>
                                <span className="text-xs sm:text-sm flex-1 line-clamp-1">
                                  {task.title || 'Tarefa sem título'}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {task.priority || 'Sem prioridade'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Nenhuma tarefa atual
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Carregando contexto...
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Memories */}
            <TabsContent value="memories" className="mt-3 sm:mt-4">
              <ScrollArea className="h-[calc(100vh-14rem)] sm:h-[calc(100vh-16rem)]">
                {memories.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {memories.map((memory) => (
                      <MemoryCard key={memory.id} memory={memory} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <Archive className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Nenhuma memória encontrada
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Insights */}
            <TabsContent value="insights" className="mt-3 sm:mt-4">
              <ScrollArea className="h-[calc(100vh-14rem)] sm:h-[calc(100vh-16rem)]">
                {insights.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {insights.map((insight) => (
                      <MemoryCard key={insight.id} memory={insight} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Nenhum insight disponível
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LumiSidebar;
