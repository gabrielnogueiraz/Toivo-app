import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Column as ColumnType, Task } from '@/types/board';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  isOverlay?: boolean;
  onAddTask?: (columnId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditColumn?: (column: ColumnType) => void;
}

export function Column({
  column,
  tasks,
  isOverlay,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
}: ColumnProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map(task => task.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col h-full min-w-60 max-w-60 md:min-w-80 md:max-w-80",
        isOverlay && "pointer-events-none"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="flex-1 p-3 md:p-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <h3 className="font-semibold text-sm md:text-base line-clamp-1">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddTask?.(column.id)}
                  className="h-7 w-7 p-0 touch-target"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditColumn?.(column)}
                  className="h-7 w-7 p-0 touch-target"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          ref={setNodeRef}
          className={cn(
            "flex-1 space-y-2 md:space-y-3 min-h-32 p-2 rounded-lg transition-colors duration-200",
            isOver && "bg-primary/5 border-2 border-dashed border-primary/30"
          )}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>

          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-6 md:py-8 text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Plus className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">
                Nenhuma tarefa ainda
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddTask?.(column.id)}
                className="text-xs touch-target"
              >
                Adicionar primeira tarefa
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
