import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, TrendingUp } from 'lucide-react';
import { TaskSelector } from '@/components/TaskSelector';
import { EnhancedTimerDisplay } from '@/components/EnhancedTimerDisplay';
import { PomodoroSettingsModal } from '@/components/PomodoroSettingsModal';
import { useActivePomodoro, useStartPomodoro, usePausePomodoro, useFinishPomodoro } from '@/hooks';
import { useEffectivePomodoroSettings } from '@/hooks/useEffectivePomodoroSettings';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PomodoroPage() {
  const { data: activePomodoro } = useActivePomodoro();
  const { settings } = useEffectivePomodoroSettings();
  const { mutate: startPomodoro } = useStartPomodoro();
  const { mutate: pausePomodoro } = usePausePomodoro();
  const { mutate: finishPomodoro } = useFinishPomodoro();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos default
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionCount, setSessionCount] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [todayStats, setTodayStats] = useState({
    completedPomodoros: 0,
    totalFocusTime: 0,
    completedTasks: 0,
    streak: 0
  });

  // Atualizar tempos baseado nas configurações do usuário
  useEffect(() => {
    if (settings && !activePomodoro) {
      const duration = mode === 'work' 
        ? settings.focusDuration 
        : mode === 'shortBreak' 
        ? settings.shortBreakTime 
        : settings.longBreakTime;
      
      const timeInSeconds = duration * 60;
      setTimeLeft(timeInSeconds);
      setTotalTime(timeInSeconds);
    }
  }, [settings, mode, activePomodoro]);

  // Sincronizar com pomodoro ativo
  useEffect(() => {
    if (activePomodoro) {
      setIsRunning(activePomodoro.status === 'IN_PROGRESS');
      
      // Calcular tempo restante baseado no pomodoro ativo
      const now = new Date();
      const startedAt = new Date(activePomodoro.startedAt);
      const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
      const totalDuration = activePomodoro.duration * 60;
      const remaining = Math.max(0, totalDuration - elapsed);
      
      setTimeLeft(remaining);
      setTotalTime(totalDuration);
    }
  }, [activePomodoro]);

  const handleStart = () => {
    if (activePomodoro) {
      setIsRunning(true);
    } else {
      // Agora a seleção de tarefa é feita pelo TaskSelector
      console.log('Selecione uma tarefa primeiro');
    }
  };

  const handlePause = () => {
    if (activePomodoro) {
      pausePomodoro(activePomodoro.id);
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    if (activePomodoro) {
      finishPomodoro(activePomodoro.id);
    }
    setIsRunning(false);
    
    // Resetar para configurações do usuário
    if (settings) {
      const duration = mode === 'work' 
        ? settings.focusDuration 
        : mode === 'shortBreak' 
        ? settings.shortBreakTime 
        : settings.longBreakTime;
      
      const timeInSeconds = duration * 60;
      setTimeLeft(timeInSeconds);
      setTotalTime(timeInSeconds);
    }
  };

  const handlePlayPause = () => {
    if (isRunning) {
      handlePause();
    } else {
      handleStart();
    }
  };

  const handleSwitchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    // Não permitir mudança de modo se há um pomodoro ativo
    if (activePomodoro) {
      console.log('Não é possível mudar de modo com pomodoro ativo');
      return;
    }
    
    setMode(newMode);
    setIsRunning(false);
    
    if (settings) {
      const duration = newMode === 'work' 
        ? settings.focusDuration 
        : newMode === 'shortBreak' 
        ? settings.shortBreakTime 
        : settings.longBreakTime;
      
      const timeInSeconds = duration * 60;
      setTimeLeft(timeInSeconds);
      setTotalTime(timeInSeconds);
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return 'Foco';
      case 'shortBreak':
        return 'Pausa Curta';
      case 'longBreak':
        return 'Pausa Longa';
      default:
        return 'Foco';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'bg-primary';
      case 'shortBreak':
        return 'bg-emerald-500';
      case 'longBreak':
        return 'bg-purple-500';
      default:
        return 'bg-primary';
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Handle timer completion
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return (
    <div className="h-full">
      {/* Header Section - Seguindo o padrão do Dashboard/Boards */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 border-b gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Timer Pomodoro</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Transforme sua produtividade com foco e elegância
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            
            {/* Timer Section - Centralizado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <Card className="p-6 md:p-8 w-full">
                <div className="relative z-10">
                  {/* Mode and Session Info */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg transition-all duration-300",
                      getModeColor(),
                      "hover:scale-105"
                    )}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        {getModeLabel()}
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                      Sessão {sessionCount}
                    </div>
                  </div>

                  {/* Active Task Display */}
                  {activePomodoro?.task && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-muted-foreground">
                          Trabalhando em:
                        </span>
                        <span className="text-sm font-medium">
                          {activePomodoro.task.title}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Enhanced Timer Display */}
                  <div className="flex justify-center mb-8">
                    <EnhancedTimerDisplay
                      timeLeft={timeLeft}
                      totalTime={totalTime}
                      isRunning={isRunning}
                      mode={mode}
                      onStart={handleStart}
                      onPause={handlePause}
                      onReset={handleReset}
                      onOpenSettings={() => setIsSettingsOpen(true)}
                    />
                  </div>

                  {/* Mode Selector - Clean Design */}
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center bg-muted p-1 rounded-full">
                      <Button
                        variant={mode === 'work' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleSwitchMode('work')}
                        disabled={!!activePomodoro}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                          mode === 'work' 
                            ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        🎯 Foco
                      </Button>
                      <Button
                        variant={mode === 'shortBreak' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleSwitchMode('shortBreak')}
                        disabled={!!activePomodoro}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                          mode === 'shortBreak' 
                            ? "bg-emerald-500 text-white shadow-lg hover:bg-emerald-600" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        ☕ Pausa
                      </Button>
                      <Button
                        variant={mode === 'longBreak' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleSwitchMode('longBreak')}
                        disabled={!!activePomodoro}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                          mode === 'longBreak' 
                            ? "bg-purple-500 text-white shadow-lg hover:bg-purple-600" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        🌟 Descanso
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Task Selector - Centralizado abaixo do timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <TaskSelector 
                currentMode={mode}
                settings={settings}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de Configurações */}
      <PomodoroSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentMode={mode}
      />
    </div>
  );
}
