import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { pomodoroService } from '@/services';
import { ACTIVE_POMODORO_QUERY_KEY } from './usePomodoro';

/**
 * Hook personalizado para sincronização inteligente do pomodoro ativo
 * Evita múltiplas requisições simultâneas e gerencia o polling de forma eficiente
 */
export const usePomodoroSync = () => {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  const startPolling = () => {
    if (isPollingRef.current) return;
    
    isPollingRef.current = true;
    
    const poll = async () => {
      try {
        // Só faz polling se a janela estiver focada
        if (document.hidden) return;
        
        const activePomodoro = await pomodoroService.getActivePomodoro();
        
        // Atualiza o cache do React Query
        queryClient.setQueryData(ACTIVE_POMODORO_QUERY_KEY, activePomodoro);
        
        // Se não há pomodoro ativo, para o polling
        if (!activePomodoro) {
          stopPolling();
        }
      } catch (error) {
        console.error('Erro ao sincronizar pomodoro:', error);
        // Em caso de erro, para o polling para evitar spam
        stopPolling();
      }
    };
    
    // Polling a cada 5 segundos
    intervalRef.current = setInterval(poll, 5000);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
  };

  // Gerenciar polling baseado no estado do pomodoro
  useEffect(() => {
    const activePomodoro = queryClient.getQueryData(ACTIVE_POMODORO_QUERY_KEY);
    
    if (activePomodoro) {
      startPolling();
    } else {
      stopPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [queryClient]);

  // Parar polling quando a janela perde foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        const activePomodoro = queryClient.getQueryData(ACTIVE_POMODORO_QUERY_KEY);
        if (activePomodoro) {
          startPolling();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopPolling();
    };
  }, [queryClient]);

  return {
    startPolling,
    stopPolling,
  };
};
