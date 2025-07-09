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
import { TaskFlowerIndicator } from './TaskFlowerIndicator';
import { CompleteTaskButton } from './CompleteTaskButton';
import { TaskWithFlowerState } from '../types/taskFlower';

interface TaskSelectorProps {
  onTaskSelect?: (task: PomodoroTask) => void;
  currentMode?: 'work' | 'shortBreak' | 'longBreak';
  settings?: {
    focusDuration: number;
    shortBreakTime: number;
    longBreakTime: number;
  };
}

export function TaskSelector({ onTaskSelect, currentMode = 'work', settings }: TaskSelectorProps) {
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
    // Usar as configurações do usuário baseado no modo atual
    const duration = settings 
      ? (currentMode === 'work' 
          ? settings.focusDuration 
          : currentMode === 'shortBreak' 
          ? settings.shortBreakTime 
          : settings.longBreakTime)
      : (currentMode === 'work' ? 25 : currentMode === 'shortBreak' ? 5 : 15);

    const breakTime = settings?.shortBreakTime || 5;

    startPomodoro({
      taskId: task.id,
      duration,
      breakTime,
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
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">
                Selecionar Tarefa
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Escolha uma tarefa para iniciar seu pomodoro
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Barra de Busca */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          <Input
            placeholder="Buscar por título, descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        {/* Filtros e Configuração */}
        <div className="space-y-4">
          {/* Filtros Expansíveis */}
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between rounded-xl hover:bg-muted transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filtros {priority !== 'ALL' && `(${getPriorityLabel(priority)})`}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isFiltersOpen && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <label className="text-sm font-medium mb-3 block">Prioridade</label>
                <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Todas as prioridades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas as prioridades</SelectItem>
                    <SelectItem value="HIGH">🔥 Alta</SelectItem>
                    <SelectItem value="MEDIUM">⚡ Média</SelectItem>
                    <SelectItem value="LOW">🌱 Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Informações de Configuração do Pomodoro */}
          {settings && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 border border-primary/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Timer className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">
                    Configuração Atual
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {currentMode === 'work' ? '🎯 Modo Foco' : currentMode === 'shortBreak' ? '☕ Pausa Curta' : '🌟 Pausa Longa'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duração configurada:</span>
                <span className="text-lg font-bold text-primary">
                  {currentMode === 'work' 
                    ? settings.focusDuration 
                    : currentMode === 'shortBreak' 
                    ? settings.shortBreakTime 
                    : settings.longBreakTime} min
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-3">
          {isLoading && (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">Carregando suas tarefas...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-sm text-destructive mb-4">Erro ao carregar tarefas</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="rounded-lg"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {!isLoading && !error && tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {search || priority !== 'ALL' ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa disponível'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search || priority !== 'ALL' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Crie algumas tarefas no seu quadro Kanban primeiro!'}
              </p>
              {search || priority !== 'ALL' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearch('');
                    setPriority('ALL');
                  }}
                  className="rounded-lg"
                >
                  Limpar filtros
                </Button>
              ) : null}
            </div>
          )}

          {!isLoading && !error && tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer",
                "bg-card border border-border",
                "hover:shadow-lg hover:border-primary/30",
                selectedTaskId === task.id && "ring-2 ring-primary/50 bg-primary/5"
              )}
              onClick={() => handleTaskSelect(task)}
            >
              <div className="p-5">
                <div className="flex flex-col gap-4">
                  {/* Header da tarefa */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <h4 className="font-semibold text-base line-clamp-2 flex-1 group-hover:text-primary transition-colors duration-200">
                          {task.title}
                        </h4>
                        <TaskFlowerIndicator 
                          task={{
                            id: task.id,
                            title: task.title,
                            completed: task.completed || false,
                            completedPomodoros: task.completedPomodoros || 0,
                            pomodoroGoal: task.pomodoroGoal || 0,
                            hasFlowers: task.hasFlowers,
                            priority: task.priority
                          } as TaskWithFlowerState}
                          className="text-xs"
                        />
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs flex items-center gap-1.5 px-2.5 py-1 flex-shrink-0 rounded-full font-medium",
                            getPriorityColor(task.priority)
                          )}
                        >
                          {getPriorityIcon(task.priority)}
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metadados e Ação */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Kanban className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {task.board?.title || 'Sem board'}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[100px] sm:max-w-none">
                          {task.column?.title || 'Sem coluna'}
                        </span>
                      </span>
                      {task.completedPomodoros !== undefined && (
                        <span className="flex items-center gap-1.5">
                          <Timer className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {task.completedPomodoros} pomodoros
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <CompleteTaskButton 
                        task={{
                          id: task.id,
                          title: task.title,
                          completed: task.completed || false,
                          completedPomodoros: task.completedPomodoros || 0,
                          pomodoroGoal: task.pomodoroGoal || 0,
                          hasFlowers: task.hasFlowers,
                          priority: task.priority
                        } as TaskWithFlowerState}
                      />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartPomodoro(task);
                        }}
                        disabled={isStarting}
                        className={cn(
                          "px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex-shrink-0",
                          "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "group-hover:scale-105"
                        )}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {isStarting ? 'Iniciando...' : 'Iniciar Pomodoro'}
                      </Button>
                    </div>
                  </div>
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
