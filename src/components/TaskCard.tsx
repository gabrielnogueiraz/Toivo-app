import { forwardRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MoreHorizontal, Calendar, Edit2, Trash2, Target, CheckCircle, Circle } from 'lucide-react';
import { Task } from '@/types/board';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useActivePomodoro, useDeleteTask, useTaskCompletion } from '@/hooks';

interface TaskCardProps {
  task: Task;
  isActive?: boolean;
  isDragging?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, isActive, isDragging, onEdit, onDelete, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: activePomodoro } = useActivePomodoro();
    const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
    const { completeTaskManually } = useTaskCompletion();
    
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isSortableDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const isTaskActive = activePomodoro?.taskId === task.id;
    const completedPomodoros = task.pomodoros.filter(p => p.status === 'COMPLETED').length;
    const pomodoroProgress = task.pomodoroGoal > 0 ? (completedPomodoros / task.pomodoroGoal) * 100 : 0;
    const isCompleted = task.completed || false;

    const handleCompleteTask = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isCompleted) {
        try {
          await completeTaskManually(task.id);
        } catch (error) {
          console.error('Erro ao completar tarefa:', error);
        }
      }
    };

    const handleDeleteTask = () => {
      deleteTask(task.id, {
        onSuccess: () => {
          onDelete?.(task.id);
        }
      });
    };

    const handleEditTask = () => {
      onEdit?.(task);
      setIsMenuOpen(false);
    };

    const handleCardClick = (e: React.MouseEvent) => {
      // Evitar abrir o modal se clicar em botões ou dropdowns
      if (
        e.target instanceof HTMLElement && 
        (e.target.closest('button') || e.target.closest('[role="menuitem"]'))
      ) {
        return;
      }
      onEdit?.(task);
    };

    const getPriorityBorderColor = () => {
      const colors = {
        HIGH: 'border-l-red-500',
        MEDIUM: 'border-l-orange-500',
        LOW: 'border-l-green-500',
      };
      return colors[task.priority];
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "relative group transition-all duration-200",
            isSortableDragging && "opacity-50 rotate-2 scale-105"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card 
            className={cn(
              "p-4 border-l-4 hover:shadow-lg transition-all duration-200 cursor-pointer",
              "bg-background hover:bg-muted/20",
              isTaskActive && "ring-2 ring-primary/50 bg-primary/5",
              isCompleted && "opacity-70 bg-muted/40",
              getPriorityBorderColor(),
              isDragging && "shadow-xl"
            )}
            onClick={handleCardClick}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header com título e status */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-semibold text-base leading-tight mb-1",
                      "text-foreground/90 hover:text-foreground transition-colors",
                      isCompleted && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </h3>
                  </div>
                  
                  
                </div>
                
                {/* Descrição */}
                {task.description && (
                  <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 mb-3">
                    {task.description}
                  </p>
                )}

                {/* Metadados */}
                <div className="space-y-2 mb-3">
                  {task.startAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatRelativeTime(task.startAt)}</span>
                    </div>
                  )}
                </div>

                {/* Progresso de Pomodoros */}
                {task.pomodoroGoal > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span className="font-medium">
                          {completedPomodoros}/{task.pomodoroGoal} Pomodoros
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {Math.round(pomodoroProgress)}%
                      </span>
                    </div>
                    <Progress 
                      value={pomodoroProgress} 
                      className="h-2 bg-muted/50" 
                    />
                  </div>
                )}
              </div>

              {/* Botões de ação */}
              <AnimatePresence>
                {(isHovered || isTaskActive || isMenuOpen) && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Botão de Pomodoro ativo */}
                    {isTaskActive && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20"
                      >
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-semibold">Ativo</span>
                      </motion.div>
                    )}
                    
                    {/* Botão de concluir tarefa */}
                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCompleteTask}
                        className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-950/30 dark:hover:text-green-400"
                        title="Concluir tarefa"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {/* Menu de opções */}
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                          disabled={isDeleting}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={handleEditTask}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar tarefa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleDeleteTask}
                          disabled={isDeleting}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {isDeleting ? 'Deletando...' : 'Deletar tarefa'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';
