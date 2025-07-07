import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pomodoroService, UpdatePomodoroSettingsRequest } from '@/services/pomodoroService';

export function usePomodoroSettings() {
  return useQuery({
    queryKey: ['pomodoro-settings'],
    queryFn: pomodoroService.getPomodoroSettings,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 1, // Tenta apenas uma vez se falhar
    retryOnMount: false,
    // Se falhar, não gera erro, apenas retorna undefined
    throwOnError: false,
  });
}

export function useUpdatePomodoroSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePomodoroSettingsRequest) =>
      pomodoroService.updatePomodoroSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['pomodoro-settings'], data);
      queryClient.invalidateQueries({ queryKey: ['pomodoro-settings'] });
    },
  });
}
