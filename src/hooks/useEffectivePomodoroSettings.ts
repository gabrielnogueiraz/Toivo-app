import { usePomodoroSettings } from './usePomodoroSettings';

export const useEffectivePomodoroSettings = () => {
  const { data: settings, isLoading, error } = usePomodoroSettings();

  // Valores padrão caso não existam configurações salvas ou haja erro
  const defaultSettings = {
    focusDuration: 25,
    shortBreakTime: 5,
    longBreakTime: 15
  };

  const effectiveSettings = settings ? {
    focusDuration: settings.focusDuration,
    shortBreakTime: settings.shortBreakTime,
    longBreakTime: settings.longBreakTime
  } : defaultSettings;

  return {
    settings: effectiveSettings,
    isLoading: isLoading && !error, // Se há erro, não está carregando
    hasUserSettings: !!settings,
    error
  };
};
