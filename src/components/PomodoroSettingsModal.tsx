import { useState, useEffect } from 'react';
import { Plus, Minus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { usePomodoroSettings, useUpdatePomodoroSettings } from '@/hooks/usePomodoroSettings';
import { cn } from '@/lib/utils';

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode?: 'work' | 'shortBreak' | 'longBreak';
}

export function PomodoroSettingsModal({
  isOpen,
  onClose,
  currentMode = 'work'
}: PomodoroSettingsModalProps) {
  const { data: settings } = usePomodoroSettings();
  const { mutate: updateSettings, isPending } = useUpdatePomodoroSettings();

  const [localSettings, setLocalSettings] = useState({
    focusDuration: 25,
    shortBreakTime: 5,
    longBreakTime: 15
  });

  // Sincronizar com as configurações do servidor
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        focusDuration: settings.focusDuration,
        shortBreakTime: settings.shortBreakTime,
        longBreakTime: settings.longBreakTime
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const updateValue = (field: keyof typeof localSettings, delta: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: Math.max(1, Math.min(120, prev[field] + delta))
    }));
  };

  const handleInputChange = (field: keyof typeof localSettings, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 1 && numValue <= 120) {
      setLocalSettings(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const settingsConfig = [
    {
      key: 'focusDuration' as const,
      label: 'Tempo de Foco',
      description: 'Duração da sessão de trabalho',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      isActive: currentMode === 'work'
    },
    {
      key: 'shortBreakTime' as const,
      label: 'Pausa Curta',
      description: 'Duração da pausa curta',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      isActive: currentMode === 'shortBreak'
    },
    {
      key: 'longBreakTime' as const,
      label: 'Pausa Longa',
      description: 'Duração da pausa longa',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      isActive: currentMode === 'longBreak'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Configurações do Pomodoro
              </DialogTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personalize seus tempos de foco e descanso
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {settingsConfig.map((config) => (
            <div
              key={config.key}
              className={cn(
                "relative overflow-hidden rounded-2xl border-2 transition-all duration-300",
                "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900",
                config.isActive 
                  ? "border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-500/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              {/* Indicador de modo ativo */}
              {config.isActive && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Ativo</span>
                  </div>
                </div>
              )}
              
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm",
                    config.isActive ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-slate-400"
                  )}>
                    {config.key === 'focusDuration' ? '🎯' : config.key === 'shortBreakTime' ? '☕' : '🌟'}
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-semibold text-base",
                      config.isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"
                    )}>
                      {config.label}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {config.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateValue(config.key, -1)}
                    disabled={localSettings[config.key] <= 1}
                    className="h-12 w-12 rounded-xl border-2 hover:scale-105 transition-transform duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      min="1"
                      max="120"
                      value={localSettings[config.key]}
                      onChange={(e) => handleInputChange(config.key, e.target.value)}
                      className="text-center text-xl font-bold h-14 border-2 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      min
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateValue(config.key, 1)}
                    disabled={localSettings[config.key] >= 120}
                    className="h-12 w-12 rounded-xl border-2 hover:scale-105 transition-transform duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border-2"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </div>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
