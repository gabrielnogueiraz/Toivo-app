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
      isActive: currentMode === 'work'
    },
    {
      key: 'shortBreakTime' as const,
      label: 'Pausa Curta',
      description: 'Duração da pausa curta',
      isActive: currentMode === 'shortBreak'
    },
    {
      key: 'longBreakTime' as const,
      label: 'Pausa Longa',
      description: 'Duração da pausa longa',
      isActive: currentMode === 'longBreak'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border shadow-lg">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Configurações do Pomodoro
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
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
                "bg-card",
                config.isActive 
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50"
              )}
            >
              {/* Indicador de modo ativo */}
              {config.isActive && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-primary">Ativo</span>
                  </div>
                </div>
              )}
              
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm",
                    config.isActive ? "bg-primary" : "bg-muted-foreground"
                  )}>
                    {config.key === 'focusDuration' ? '🎯' : config.key === 'shortBreakTime' ? '☕' : '🌟'}
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-semibold text-base",
                      config.isActive ? "text-primary" : "text-foreground"
                    )}>
                      {config.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
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
                      className="text-center text-xl font-bold h-14 border-2 rounded-xl bg-background focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-medium">
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

        <div className="flex gap-3 pt-6 border-t border-border">
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
            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
