import { forwardRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, MoreHorizontal, Calendar, Flag } from 'lucide-react';
import { Task } from '@/types/board';
import { cn, formatRelativeTime, getPriorityColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useActivePomodoro, useStartPomodoro } from '@/hooks';

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
    const { data: activePomodoro } = useActivePomodoro();
    const { mutate: startPomodoro } = useStartPomodoro();
    
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

    const handleStartPomodoro = () => {
      if (!activePomodoro) {
        startPomodoro({
          taskId: task.id,
          duration: 25,
          breakTime: 5,
        });
      }
    };

    const getPriorityBadge = () => {
      const variants = {
        HIGH: 'bg-red-500/10 text-red-500 border-red-500/20',
        MEDIUM: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        LOW: 'bg-green-500/10 text-green-500 border-green-500/20',
      };
      
      return variants[task.priority];
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
            "relative group cursor-pointer transition-all duration-200",
            isSortableDragging && "opacity-50 rotate-2 scale-105"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className={cn(
            "p-3 md:p-4 border-l-4 hover:shadow-lg transition-all duration-200 touch-target",
            isTaskActive && "ring-2 ring-primary/50 bg-primary/5",
            task.priority === 'HIGH' && "border-l-red-500",
            task.priority === 'MEDIUM' && "border-l-orange-500",
            task.priority === 'LOW' && "border-l-green-500",
            isDragging && "shadow-xl"
          )}>
            <div className="flex items-start justify-between gap-2 md:gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {task.title}
                  </h3>
                  <Badge variant="outline" className={cn(getPriorityBadge(), "text-xs")}>
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority.toLowerCase()}
                  </Badge>
                </div>
                
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2 md:mb-3">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 md:mb-3">
                  {task.startAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatRelativeTime(task.startAt)}</span>
                    </div>
                  )}
                </div>

                {task.pomodoroGoal > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Pomodoros: {completedPomodoros}/{task.pomodoroGoal}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(pomodoroProgress)}%
                      </span>
                    </div>
                    <Progress value={pomodoroProgress} className="h-1" />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {(isHovered || isTaskActive) && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1"
                  >
                    {!activePomodoro && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleStartPomodoro}
                        className="h-6 w-6 p-0 touch-target"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    
                    {isTaskActive && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">Ativo</span>
                      </motion.div>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit?.(task)}
                      className="h-6 w-6 p-0 touch-target"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
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
