import { useEffect } from 'react';
import { useKanbanStore } from '@/stores';
import { useBoards, useActivePomodoro } from '@/hooks';

export const useKanbanSync = () => {
  const { 
    setBoards, 
    setActivePomodoro, 
    setLoading, 
    setError 
  } = useKanbanStore();
  
  const { 
    data: boards, 
    isLoading: boardsLoading, 
    error: boardsError 
  } = useBoards();
  
  const { 
    data: activePomodoro, 
    isLoading: pomodoroLoading, 
    error: pomodoroError 
  } = useActivePomodoro();

  // Sincronizar boards com o store
  useEffect(() => {
    if (boards) {
      setBoards(boards);
    }
  }, [boards, setBoards]);

  // Sincronizar pomodoro ativo com o store
  useEffect(() => {
    setActivePomodoro(activePomodoro || null);
  }, [activePomodoro, setActivePomodoro]);

  // Sincronizar estados de loading e erro
  useEffect(() => {
    const isLoading = boardsLoading || pomodoroLoading;
    const error = boardsError || pomodoroError;
    
    setLoading(isLoading);
    setError(error ? error.message : null);
  }, [boardsLoading, pomodoroLoading, boardsError, pomodoroError, setLoading, setError]);

  return {
    boards,
    activePomodoro,
    isLoading: boardsLoading || pomodoroLoading,
    error: boardsError || pomodoroError,
  };
};
