import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services';
import { Task, CreateTaskRequest, UpdateTaskRequest, MoveTaskRequest } from '@/types/board';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export const useTasks = () => {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: taskService.getTasks,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useTasksByColumn = (columnId: string) => {
  return useQuery({
    queryKey: ['tasks', 'column', columnId],
    queryFn: () => taskService.getTasksByColumn(columnId),
    enabled: !!columnId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskService.createTask(data),
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) => {
        return old ? [...old, newTask] : [newTask];
      });
      queryClient.setQueryData<Task[]>(['tasks', 'column', newTask.columnId], (old) => {
        return old ? [...old, newTask] : [newTask];
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      taskService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) => {
        return old ? old.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ) : [updatedTask];
      });
      queryClient.setQueryData(['task', updatedTask.id], updatedTask);
      queryClient.setQueryData<Task[]>(['tasks', 'column', updatedTask.columnId], (old) => {
        return old ? old.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ) : [updatedTask];
      });
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveTaskRequest }) =>
      taskService.moveTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
      
      if (previousTasks) {
        const updatedTasks = previousTasks.map(task => 
          task.id === id ? { ...task, columnId: data.columnId } : task
        );
        queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, updatedTasks);
      }
      
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) => {
        return old ? old.filter(task => task.id !== deletedId) : [];
      });
      queryClient.removeQueries({ queryKey: ['task', deletedId] });
    },
  });
};
