import { useQuery } from '@tanstack/react-query';
import { pomodoroService, PomodoroTasksParams } from '@/services/pomodoroService';
import { useDebounce } from './useDebounce';

export function usePomodoroTasks(filters?: PomodoroTasksParams) {
  // Debounce a busca por texto para evitar muitas requisições
  const debouncedSearch = useDebounce(filters?.search || '', 300);

  const debouncedFilters = {
    ...filters,
    search: debouncedSearch,
  };

  return useQuery({
    queryKey: ['pomodoro-tasks', debouncedFilters],
    queryFn: () => pomodoroService.getPomodoroTasks(debouncedFilters),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
}
