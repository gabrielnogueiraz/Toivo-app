import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Pomodoro } from '@/types/board';

interface PomodoroState {
  // Estado do timer
  isVisible: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  
  // Configurações
  defaultDuration: number; // minutos
  defaultBreakTime: number; // minutos
  enableNotifications: boolean;
  enableSounds: boolean;
  
  // Estatísticas da sessão
  sessionsCompleted: number;
  totalFocusTime: number; // minutos
  
  // Ações
  setTimerVisibility: (visible: boolean) => void;
  setTimerMinimized: (minimized: boolean) => void;
  setTimerFullscreen: (fullscreen: boolean) => void;
  
  setDefaultDuration: (duration: number) => void;
  setDefaultBreakTime: (breakTime: number) => void;
  setEnableNotifications: (enabled: boolean) => void;
  setEnableSounds: (enabled: boolean) => void;
  
  incrementSessionsCompleted: () => void;
  addFocusTime: (minutes: number) => void;
  
  reset: () => void;
}

const initialState = {
  isVisible: false,
  isMinimized: false,
  isFullscreen: false,
  defaultDuration: 25,
  defaultBreakTime: 5,
  enableNotifications: true,
  enableSounds: true,
  sessionsCompleted: 0,
  totalFocusTime: 0,
};

export const usePomodoroStore = create<PomodoroState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      // Timer visibility actions
      setTimerVisibility: (visible) => set({ isVisible: visible }),
      setTimerMinimized: (minimized) => set({ isMinimized: minimized }),
      setTimerFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
      
      // Configuration actions
      setDefaultDuration: (duration) => set({ defaultDuration: duration }),
      setDefaultBreakTime: (breakTime) => set({ defaultBreakTime: breakTime }),
      setEnableNotifications: (enabled) => set({ enableNotifications: enabled }),
      setEnableSounds: (enabled) => set({ enableSounds: enabled }),
      
      // Statistics actions
      incrementSessionsCompleted: () => set((state) => ({ 
        sessionsCompleted: state.sessionsCompleted + 1 
      })),
      addFocusTime: (minutes) => set((state) => ({ 
        totalFocusTime: state.totalFocusTime + minutes 
      })),
      
      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'pomodoro-store',
    }
  )
);
