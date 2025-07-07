import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Target, ChevronDown, Kanban, FileText, Timer, AlertTriangle, Zap, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePomodoroTasks, useStartPomodoro } from '@/hooks';
import { PomodoroTask } from '@/types/board';
import { cn } from '@/lib/utils';

interface TaskSelectorProps {
  onTaskSelect?: (task: PomodoroTask) => void;
}

export function TaskSelector({ onTaskSelect }: TaskSelectorProps) {
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'ALL'>('ALL');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data: tasks = [], isLoading, error } = usePomodoroTasks({
    search: search || undefined,
    priority: priority === 'ALL' ? undefined : priority,
  });

  const { mutate: startPomodoro, isPending: isStarting } = useStartPomodoro();

  const handleTaskSelect = (task: PomodoroTask) => {
    setSelectedTaskId(task.id);
    onTaskSelect?.(task);
  };

  const handleStartPomodoro = (task: PomodoroTask) => {
    startPomodoro({
      taskId: task.id,
      duration: 25, // 25 minutos padrão
      breakTime: 5, // 5 minutos de pausa padrão
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900/50';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-900/50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertTriangle className="w-3 h-3" />;
      case 'MEDIUM':
        return <Zap className="w-3 h-3" />;
      case 'LOW':
        return <Circle className="w-3 h-3" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'Alta';
      case 'MEDIUM':
        return 'Média';
      case 'LOW':
        return 'Baixa';
      default:
        return priority;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
            <span className="truncate">Selecionar Tarefa para Pomodoro</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs self-start sm:self-center flex-shrink-0">
            {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 md:space-y-4">
        {/* Barra de Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        {/* Filtros Expansíveis */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between text-sm">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Filtros {priority !== 'ALL' && `(${getPriorityLabel(priority)})`}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isFiltersOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Prioridade</label>
              <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Todas as prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as prioridades</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Lista de Tarefas */}
        <div className="space-y-2 md:space-y-3">
          {isLoading && (
            <div className="text-center py-6 md:py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Carregando tarefas...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-6 md:py-8">
              <p className="text-sm text-red-600 mb-2">Erro ao carregar tarefas</p>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          )}

          {!isLoading && !error && tasks.length === 0 && (
            <div className="text-center py-6 md:py-8">
              <Target className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">
                {search || priority !== 'ALL' ? 'Nenhuma tarefa encontrada com os filtros aplicados' : 'Nenhuma tarefa disponível'}
              </p>
              {search || priority !== 'ALL' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    setSearch('');
                    setPriority('ALL');
                  }}
                >
                  Limpar filtros
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Crie algumas tarefas no seu quadro Kanban primeiro!
                </p>
              )}
            </div>
          )}

          {!isLoading && !error && tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "border rounded-lg p-3 md:p-4 cursor-pointer transition-all duration-200 hover:shadow-md touch-target",
                selectedTaskId === task.id 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => handleTaskSelect(task)}
            >
              <div className="flex flex-col gap-3">
                {/* Header da tarefa */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h4 className="font-medium text-sm md:text-base line-clamp-2 flex-1">
                        {task.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs flex items-center gap-1 flex-shrink-0", getPriorityColor(task.priority))}
                      >
                        {getPriorityIcon(task.priority)}
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metadados e Ação */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Kanban className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[120px] sm:max-w-none">
                        {task.board?.title || 'Sem board'}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        {task.column?.title || 'Sem coluna'}
                      </span>
                    </span>
                    {task.completedPomodoros !== undefined && (
                      <span className="flex items-center gap-1">
                        <Timer className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {task.completedPomodoros} pomodoros
                        </span>
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartPomodoro(task);
                    }}
                    disabled={isStarting}
                    className="text-xs px-3 py-1.5 h-auto self-start sm:self-center flex-shrink-0"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {isStarting ? 'Iniciando...' : 'Iniciar'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskSelector;
