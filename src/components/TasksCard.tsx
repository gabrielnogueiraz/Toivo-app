import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, ListChecks, MoreHorizontal, Target, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useStats } from '@/hooks/useStats';
import { Task } from '@/services/statsService';

type Period = 'today' | 'week' | 'month';

interface TasksCardProps {
  className?: string;
}

export function TasksCard({ className }: TasksCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('today');
  const { data, loading, errors, loadTasks } = useStats();
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks(true); // Incluir tarefas incompletas
  }, [loadTasks]);

  const periodLabels = {
    today: 'Hoje',
    week: 'Esta Semana', 
    month: 'Este Mês'
  };

  const currentTasks = data.tasks?.[selectedPeriod] || [];
  const completedTasks = currentTasks.filter(task => task.completed);
  const pendingTasks = currentTasks.filter(task => !task.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Alta';
      case 'MEDIUM': return 'Média';
      case 'LOW': return 'Baixa';
      default: return priority;
    }
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        task.completed 
          ? 'bg-muted/50 border-muted text-muted-foreground' 
          : 'bg-background border-border hover:bg-muted/30'
      }`}
    >
      <div className="mt-0.5">
        {task.completed ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
        )}
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <h4 className={`text-sm font-medium leading-tight ${
            task.completed ? 'line-through' : ''
          }`}>
            {task.title}
          </h4>
          <Badge variant={getPriorityColor(task.priority)} className="text-xs ml-2">
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{task.column.board.title}</span>
          <span>•</span>
          <span>{task.column.title}</span>
          {task._count.pomodoros > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task._count.pomodoros}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="w-4 h-4 rounded-full mt-0.5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecks className="w-5 h-5" />
            Suas Tarefas
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {(Object.keys(periodLabels) as Period[]).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="h-7 px-2 text-xs"
                >
                  {periodLabels[period]}
                </Button>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/boards')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {loading.tasks ? (
          <LoadingSkeleton />
        ) : errors.tasks ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-sm text-muted-foreground mb-4">
              Erro ao carregar tarefas
            </p>
            <Button onClick={() => loadTasks(true)} variant="outline" size="sm">
              Tentar novamente
            </Button>
          </div>
        ) : currentTasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm text-muted-foreground">
              Nenhuma tarefa encontrada para {periodLabels[selectedPeriod].toLowerCase()}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resumo */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {currentTasks.length} total
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  {completedTasks.length} concluídas
                </span>
              </div>
              
              {completedTasks.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {Math.round((completedTasks.length / currentTasks.length) * 100)}% completo
                </Badge>
              )}
            </div>
            
            {/* Lista de tarefas */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* Tarefas pendentes primeiro */}
              {pendingTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              
              {/* Tarefas concluídas por último */}
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
            
                         <div className="pt-2 border-t">
               <Button 
                 variant="ghost" 
                 size="sm" 
                 className="w-full text-xs"
                 onClick={() => navigate('/boards')}
               >
                 <ChevronRight className="w-4 h-4 mr-1" />
                 Gerenciar tarefas
               </Button>
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 