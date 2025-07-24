import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Timer, 
  Users,
  RotateCcw, 
  Settings,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { TaskSelector } from '@/components/TaskSelector';
import { PomodoroSettingsModal } from '@/components/PomodoroSettingsModal';
import { useActivePomodoro, useStartPomodoro, usePausePomodoro, useFinishPomodoro } from '@/hooks';
import { useEffectivePomodoroSettings } from '@/hooks/useEffectivePomodoroSettings';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function PomodoroPage() {
  const { data: activePomodoro } = useActivePomodoro();
  const { settings } = useEffectivePomodoroSettings();
  const { mutate: startPomodoro } = useStartPomodoro();
  const { mutate: pausePomodoro } = usePausePomodoro();
  const { mutate: finishPomodoro } = useFinishPomodoro();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionCount, setSessionCount] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTaskSelector, setShowTaskSelector] = useState(false);

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
      
      const now = new Date();
      const startedAt = new Date(activePomodoro.startedAt);
      const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
      const totalDuration = activePomodoro.duration * 60;
      const remaining = Math.max(0, totalDuration - elapsed);
      
      setTimeLeft(remaining);
      setTotalTime(totalDuration);
    }
  }, [activePomodoro]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activePomodoro) {
      setIsRunning(false);
      finishPomodoro(activePomodoro.id);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activePomodoro, finishPomodoro]);

  const handleStart = () => {
    if (activePomodoro) {
      setIsRunning(true);
    } else {
      setShowTaskSelector(true);
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

  const handleSwitchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    if (activePomodoro) return;
    
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

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const getModeConfig = () => {
    switch (mode) {
      case 'work':
        return {
          label: 'Foco',
          icon: Timer,
          color: 'text-primary',
          bgColor: 'bg-primary/10 dark:bg-primary/5',
          borderColor: 'border-primary/20 dark:border-primary/10'
        };
      case 'shortBreak':
        return {
          label: 'Pausa Curta',
          icon: Users,
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
          borderColor: 'border-emerald-200 dark:border-emerald-800'
        };
      case 'longBreak':
        return {
          label: 'Descanso Longo',
          icon: Square,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50 dark:bg-purple-950/20',
          borderColor: 'border-purple-200 dark:border-purple-800'
        };
      default:
        return {
          label: 'Foco',
          icon: Timer,
          color: 'text-primary',
          bgColor: 'bg-primary/10 dark:bg-primary/5',
          borderColor: 'border-primary/20 dark:border-primary/10'
        };
    }
  };

  const modeConfig = getModeConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Timer Pomodoro</h1>
              <p className="text-sm text-muted-foreground">
                Técnica de produtividade focada
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Timer Central */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-12"
          >
            <Card className={cn(
              "border-2 transition-all duration-300",
              modeConfig.borderColor,
              modeConfig.bgColor
            )}>
              <CardContent className="p-8 md:p-12">
                
                {/* Mode Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm">
                    <modeConfig.icon className={cn("w-4 h-4", modeConfig.color)} />
                    <span className={cn("text-sm font-medium", modeConfig.color)}>
                      {modeConfig.label}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      Sessão {sessionCount}
                    </Badge>
                  </div>
                </motion.div>

                {/* Active Task Display */}
                <AnimatePresence>
                  {activePomodoro?.task && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center mb-8"
                    >
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-background rounded-full border">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-muted-foreground">Trabalhando em:</span>
                        <span className="font-medium">{activePomodoro.task.title}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Timer Display */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative"
                  >
                    <div className="text-6xl md:text-8xl font-mono font-bold tracking-tight">
                      {formatTime(timeLeft)}
                    </div>
                    
                    {/* Progress Ring */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                      <svg className="w-full h-full max-w-[200px] md:max-w-[300px] -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-muted-foreground/20"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className={modeConfig.color}
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 283" }}
                          animate={{ strokeDasharray: `${progress * 2.83} 283` }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                      </svg>
                    </div>
                    
                    <Progress value={progress} className="mt-4 h-2" />
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={isRunning ? handlePause : handleStart}
                      size="lg"
                      className={cn(
                        "gap-2 px-8 py-3 text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl",
                        isRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"
                      )}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          {activePomodoro ? 'Continuar' : 'Iniciar'}
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="lg"
                      className="gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                      disabled={!activePomodoro && timeLeft === totalTime}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Resetar
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mode Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex justify-center">
              <div className="inline-flex items-center bg-muted/50 backdrop-blur-sm p-1 rounded-2xl border border-border/50 shadow-lg">
                {[
                  { mode: 'work', icon: Timer, label: 'Foco' },
                  { mode: 'shortBreak', icon: Users, label: 'Pausa' },
                  { mode: 'longBreak', icon: Square, label: 'Descanso' }
                ].map(({ mode: buttonMode, icon: Icon, label }) => (
                  <motion.div
                    key={buttonMode}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={mode === buttonMode ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleSwitchMode(buttonMode as any)}
                      disabled={!!activePomodoro}
                      className="rounded-xl gap-2 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Task Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Seleção de Tarefa
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTaskSelector(!showTaskSelector)}
                    className="gap-2"
                  >
                    <Timer className="w-4 h-4" />
                    {showTaskSelector ? 'Ocultar' : 'Selecionar Tarefa'}
                  </Button>
                </div>
                
                {!activePomodoro && !showTaskSelector && (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Clique em "Selecionar Tarefa" para começar um pomodoro</p>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {showTaskSelector && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaskSelector 
                        currentMode={mode}
                        settings={settings}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>

      {/* Settings Modal */}
      <PomodoroSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentMode={mode}
      />
    </div>
  );
}
