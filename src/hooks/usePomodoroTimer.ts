import { useState, useEffect, useCallback } from 'react';
import { Pomodoro } from '@/types/board';

export interface PomodoroTimer {
  timeLeft: number;
  progress: number;
  isActive: boolean;
  isCompleted: boolean;
  formattedTime: string;
}

export const usePomodoroTimer = (pomodoro: Pomodoro | null | undefined): PomodoroTimer => {
  const [timeLeft, setTimeLeft] = useState(0);

  const calculateTimeLeft = useCallback(() => {
    if (!pomodoro || pomodoro.status !== 'IN_PROGRESS') return 0;
    
    const now = new Date();
    const startTime = new Date(pomodoro.startedAt);
    const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const totalSeconds = pomodoro.duration * 60;
    
    return Math.max(0, totalSeconds - elapsedSeconds);
  }, [pomodoro]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (!pomodoro || pomodoro.status !== 'IN_PROGRESS') {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    };

    // Atualizar imediatamente
    updateTimer();

    // Configurar intervalo
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [pomodoro, calculateTimeLeft]);

  const totalSeconds = pomodoro?.duration ? pomodoro.duration * 60 : 0;
  const progress = totalSeconds > 0 ? 1 - (timeLeft / totalSeconds) : 0;
  const isActive = pomodoro?.status === 'IN_PROGRESS' && timeLeft > 0;
  const isCompleted = pomodoro?.status === 'COMPLETED' || timeLeft === 0;

  return {
    timeLeft,
    progress,
    isActive,
    isCompleted,
    formattedTime: formatTime(timeLeft),
  };
};
