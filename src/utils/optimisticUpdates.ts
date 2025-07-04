import { QueryClient } from '@tanstack/react-query';
import { Task, Board, Column } from '@/types/board';

export interface OptimisticContext {
  previousData: any;
  rollback: () => void;
}

export const createOptimisticOperations = (queryClient: QueryClient) => {
  const moveTaskOptimistic = async (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    newOrder?: number
  ): Promise<OptimisticContext> => {
    // Cancelar queries relacionadas
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    await queryClient.cancelQueries({ queryKey: ['boards'] });

    // Obter dados atuais
    const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
    const previousBoards = queryClient.getQueryData<Board[]>(['boards']);

    // Função de rollback
    const rollback = () => {
      if (previousTasks) {
        queryClient.setQueryData(['tasks'], previousTasks);
      }
      if (previousBoards) {
        queryClient.setQueryData(['boards'], previousBoards);
      }
    };

    // Atualizar dados otimisticamente
    if (previousTasks) {
      const updatedTasks = previousTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            columnId: toColumnId,
            order: newOrder !== undefined ? newOrder : task.order,
          };
        }
        return task;
      });
      queryClient.setQueryData(['tasks'], updatedTasks);
    }

    if (previousBoards) {
      const updatedBoards = previousBoards.map(board => ({
        ...board,
        columns: board.columns.map(column => {
          if (column.id === fromColumnId) {
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== taskId),
            };
          }
          if (column.id === toColumnId) {
            const taskToMove = previousTasks?.find(task => task.id === taskId);
            if (taskToMove) {
              const updatedTask = {
                ...taskToMove,
                columnId: toColumnId,
                order: newOrder !== undefined ? newOrder : taskToMove.order,
              };
              return {
                ...column,
                tasks: [...column.tasks, updatedTask],
              };
            }
          }
          return column;
        }),
      }));
      queryClient.setQueryData(['boards'], updatedBoards);
    }

    return {
      previousData: { tasks: previousTasks, boards: previousBoards },
      rollback,
    };
  };

  const createTaskOptimistic = async (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'pomodoros'>,
    tempId: string
  ): Promise<OptimisticContext> => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    await queryClient.cancelQueries({ queryKey: ['boards'] });

    const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
    const previousBoards = queryClient.getQueryData<Board[]>(['boards']);

    const rollback = () => {
      if (previousTasks) {
        queryClient.setQueryData(['tasks'], previousTasks);
      }
      if (previousBoards) {
        queryClient.setQueryData(['boards'], previousBoards);
      }
    };

    // Criar tarefa temporária
    const tempTask: Task = {
      ...task,
      id: tempId,
      pomodoros: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Atualizar lista de tarefas
    if (previousTasks) {
      queryClient.setQueryData(['tasks'], [...previousTasks, tempTask]);
    }

    // Atualizar boards
    if (previousBoards) {
      const updatedBoards = previousBoards.map(board => ({
        ...board,
        columns: board.columns.map(column => {
          if (column.id === task.columnId) {
            return {
              ...column,
              tasks: [...column.tasks, tempTask],
            };
          }
          return column;
        }),
      }));
      queryClient.setQueryData(['boards'], updatedBoards);
    }

    return {
      previousData: { tasks: previousTasks, boards: previousBoards },
      rollback,
    };
  };

  const updateTaskOptimistic = async (
    taskId: string,
    updates: Partial<Task>
  ): Promise<OptimisticContext> => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    await queryClient.cancelQueries({ queryKey: ['boards'] });

    const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
    const previousBoards = queryClient.getQueryData<Board[]>(['boards']);

    const rollback = () => {
      if (previousTasks) {
        queryClient.setQueryData(['tasks'], previousTasks);
      }
      if (previousBoards) {
        queryClient.setQueryData(['boards'], previousBoards);
      }
    };

    // Atualizar tarefas
    if (previousTasks) {
      const updatedTasks = previousTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      queryClient.setQueryData(['tasks'], updatedTasks);
    }

    // Atualizar boards
    if (previousBoards) {
      const updatedBoards = previousBoards.map(board => ({
        ...board,
        columns: board.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),
      }));
      queryClient.setQueryData(['boards'], updatedBoards);
    }

    return {
      previousData: { tasks: previousTasks, boards: previousBoards },
      rollback,
    };
  };

  return {
    moveTaskOptimistic,
    createTaskOptimistic,
    updateTaskOptimistic,
  };
};

// Utility para gerar IDs temporários
export const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Utility para operações com delay (simular latência em desenvolvimento)
export const withDelay = <T>(fn: () => T, delay: number = 300): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(fn()), delay);
  });
};
