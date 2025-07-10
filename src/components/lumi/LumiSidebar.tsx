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
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {memory.type.replace('_', ' ')}
          </Badge>
          <Badge variant={memory.importance === 'HIGH' ? 'destructive' : 
                           memory.importance === 'MEDIUM' ? 'default' : 'secondary'}>
            {memory.importance}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">
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
      'w-80 border-l bg-muted/30 flex flex-col',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Contexto</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refreshContext();
              refreshMemories();
              refreshInsights();
            }}
            disabled={loading}
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="context">
              <User className="h-4 w-4 mr-1" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="memories">
              <Brain className="h-4 w-4 mr-1" />
              Memórias
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Lightbulb className="h-4 w-4 mr-1" />
              Insights
            </TabsTrigger>
          </TabsList>

          <div className="p-4 pt-2">
            {/* User Context */}
            <TabsContent value="context" className="mt-4">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {userContext ? (
                  <div className="space-y-4">
                    {/* User Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {userContext.user.name}
                        </CardTitle>
                        <CardDescription>
                          ID: {userContext.user.id}
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Atividade Recente
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {userContext.recentActivity.length > 0 ? (
                          <div className="space-y-3">
                            {userContext.recentActivity.slice(0, 5).map((activity, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">
                                    {activity.type}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {activity.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(activity.timestamp).toLocaleString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Nenhuma atividade recente
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Current Tasks */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Tarefas Atuais
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {userContext.currentTasks.length > 0 ? (
                          <div className="space-y-2">
                            {userContext.currentTasks.slice(0, 5).map((task, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className={cn(
                                  'w-2 h-2 rounded-full',
                                  task.completed ? 'bg-green-500' : 'bg-yellow-500'
                                )}></div>
                                <span className="text-sm flex-1 line-clamp-1">
                                  {task.title}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Nenhuma tarefa atual
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">
                      Carregando contexto...
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Memories */}
            <TabsContent value="memories" className="mt-4">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {memories.length > 0 ? (
                  <div className="space-y-4">
                    {memories.map((memory) => (
                      <MemoryCard key={memory.id} memory={memory} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <Archive className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Nenhuma memória encontrada
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Insights */}
            <TabsContent value="insights" className="mt-4">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {insights.length > 0 ? (
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <MemoryCard key={insight.id} memory={insight} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
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
