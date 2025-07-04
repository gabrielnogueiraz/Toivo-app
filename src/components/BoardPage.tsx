import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Search, Check, X } from 'lucide-react';
import { useBoards, useTasks, useMoveTask, useKanbanSync, useCreateColumn, useCreateTask } from '@/hooks';
import { Task, Column as ColumnType } from '@/types/board';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { PomodoroTimer } from './PomodoroTimer';

interface BoardPageProps {
  boardId: string;
}

export function BoardPage({ boardId }: BoardPageProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [taskModalState, setTaskModalState] = useState<{
    isOpen: boolean;
    columnId?: string;
    task?: Task;
  }>({ isOpen: false });
  
  const { data: boards, isLoading: boardsLoading } = useBoards();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { mutate: moveTask } = useMoveTask();
  const { mutate: createColumn, isPending: isCreatingColumnPending } = useCreateColumn();
  const { mutate: createTask } = useCreateTask();
  
  useKanbanSync();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const activeBoard = boards?.find(board => board.id === boardId);
  const isLoading = boardsLoading || tasksLoading;

  const filteredTasks = tasks?.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getTasksByColumn = useCallback((columnId: string) => {
    return filteredTasks
      .filter(task => task.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  }, [filteredTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks?.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks?.find(t => t.id === activeId);
    const overTask = tasks?.find(t => t.id === overId);

    if (!activeTask) return;

    // Se estamos sobre uma coluna
    if (activeBoard?.columns.find(col => col.id === overId)) {
      if (activeTask.columnId !== overId) {
        moveTask({
          id: activeTask.id,
          data: { columnId: overId as string }
        });
      }
      return;
    }

    // Se estamos sobre uma tarefa
    if (overTask && activeTask.columnId !== overTask.columnId) {
      moveTask({
        id: activeTask.id,
        data: { columnId: overTask.columnId }
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks?.find(t => t.id === activeId);
    if (!activeTask) return;

    // Se foi dropado em uma coluna
    if (activeBoard?.columns.find(col => col.id === overId)) {
      if (activeTask.columnId !== overId) {
        moveTask({
          id: activeTask.id,
          data: { columnId: overId as string }
        });
      }
    }
  };

  const handleCreateColumn = () => {
    if (newColumnName.trim() && activeBoard) {
      createColumn({
        title: newColumnName.trim(),
        boardId: activeBoard.id,
        order: activeBoard.columns.length,
      }, {
        onSuccess: () => {
          setIsCreatingColumn(false);
          setNewColumnName('');
        }
      });
    }
  };

  const handleCancelCreateColumn = () => {
    setIsCreatingColumn(false);
    setNewColumnName('');
  };

  const handleColumnKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateColumn();
    } else if (e.key === 'Escape') {
      handleCancelCreateColumn();
    }
  };

  const handleAddTask = (columnId: string) => {
    setTaskModalState({ isOpen: true, columnId });
  };

  const handleEditTask = (task: Task) => {
    setTaskModalState({ isOpen: true, task, columnId: task.columnId });
  };

  const handleDeleteTask = (taskId: string) => {
    // Implementar delete task
    console.log('Delete task:', taskId);
  };

  const handleEditColumn = (column: ColumnType) => {
    // Implementar edit column
    console.log('Edit column:', column);
  };

  const closeTaskModal = () => {
    setTaskModalState({ isOpen: false });
  };

  if (isLoading) {
    return (
      <div className="h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        <div className="flex gap-6 h-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-80">
              <Skeleton className="h-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activeBoard) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Board não encontrado</h2>
          <p className="text-muted-foreground">
            O board que você está procurando não existe ou foi removido.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 border-b gap-4"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <h1 className="text-lg md:text-2xl font-bold line-clamp-1">{activeBoard.title}</h1>
            <Button variant="ghost" size="sm" className="touch-target">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            <Button className="touch-target">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nova tarefa</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>
        </motion.div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 md:gap-6 p-4 md:p-6 h-full min-w-max">
            <SortableContext
              items={activeBoard.columns.map(col => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              <AnimatePresence>
                {activeBoard.columns
                  .sort((a, b) => a.order - b.order)
                  .map((column) => (
                    <motion.div
                      key={column.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Column
                        column={column}
                        tasks={getTasksByColumn(column.id)}
                        onAddTask={handleAddTask}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onEditColumn={handleEditColumn}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </SortableContext>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-w-60 md:min-w-80"
            >
              {!isCreatingColumn ? (
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingColumn(true)}
                  className="w-full h-24 md:h-32 border-2 border-dashed hover:border-primary/50 touch-target"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="text-sm md:text-base">Adicionar coluna</span>
                </Button>
              ) : (
                <Card className="w-full h-24 md:h-32 p-3 md:p-4 border-2 border-dashed">
                  <div className="flex items-center gap-2 h-full">
                    <Input
                      placeholder="Nome da coluna..."
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      onKeyDown={handleColumnKeyPress}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleCreateColumn}
                      disabled={!newColumnName.trim() || isCreatingColumnPending}
                      className="touch-target"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelCreateColumn}
                      className="touch-target"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 scale-105">
            <TaskCard
              task={activeTask}
              isDragging
            />
          </div>
        )}
      </DragOverlay>

      <TaskModal
        isOpen={taskModalState.isOpen}
        onClose={closeTaskModal}
        columnId={taskModalState.columnId || taskModalState.task?.columnId || ''}
        task={taskModalState.task}
      />
    </DndContext>
  );
}
