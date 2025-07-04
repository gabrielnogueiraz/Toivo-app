import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pomodoroService } from '@/services';
import { Pomodoro, StartPomodoroRequest } from '@/types/board';

export const POMODOROS_QUERY_KEY = ['pomodoros'] as const;
export const ACTIVE_POMODORO_QUERY_KEY = ['pomodoro', 'active'] as const;

export const usePomodoros = () => {
  return useQuery({
    queryKey: POMODOROS_QUERY_KEY,
    queryFn: pomodoroService.getPomodoros,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useActivePomodoro = () => {
  return useQuery({
    queryKey: ACTIVE_POMODORO_QUERY_KEY,
    queryFn: pomodoroService.getActivePomodoro,
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    // Removido o polling automático para evitar spam de requisições
  });
};

export const usePomodoro = (id: string) => {
  return useQuery({
    queryKey: ['pomodoro', id],
    queryFn: () => pomodoroService.getPomodoro(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 segundos
  });
};

export const useStartPomodoro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartPomodoroRequest) => pomodoroService.startPomodoro(data),
    onSuccess: (newPomodoro) => {
      queryClient.setQueryData<Pomodoro | null>(ACTIVE_POMODORO_QUERY_KEY, newPomodoro);
      queryClient.setQueryData<Pomodoro[]>(POMODOROS_QUERY_KEY, (old) => {
        return old ? [...old, newPomodoro] : [newPomodoro];
      });
    },
  });
};

export const usePausePomodoro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pomodoroService.pausePomodoro(id),
    onSuccess: (updatedPomodoro) => {
      queryClient.setQueryData<Pomodoro | null>(ACTIVE_POMODORO_QUERY_KEY, updatedPomodoro);
      queryClient.setQueryData(['pomodoro', updatedPomodoro.id], updatedPomodoro);
    },
  });
};

export const useResumePomodoro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pomodoroService.resumePomodoro(id),
    onSuccess: (updatedPomodoro) => {
      queryClient.setQueryData<Pomodoro | null>(ACTIVE_POMODORO_QUERY_KEY, updatedPomodoro);
      queryClient.setQueryData(['pomodoro', updatedPomodoro.id], updatedPomodoro);
    },
  });
};

export const useFinishPomodoro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pomodoroService.finishPomodoro(id),
    onSuccess: (completedPomodoro) => {
      queryClient.setQueryData<Pomodoro | null>(ACTIVE_POMODORO_QUERY_KEY, null);
      queryClient.setQueryData(['pomodoro', completedPomodoro.id], completedPomodoro);
      queryClient.setQueryData<Pomodoro[]>(POMODOROS_QUERY_KEY, (old) => {
        return old ? old.map(pomodoro => 
          pomodoro.id === completedPomodoro.id ? completedPomodoro : pomodoro
        ) : [completedPomodoro];
      });
    },
  });
};
