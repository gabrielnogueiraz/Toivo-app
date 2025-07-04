import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Clock, Target, TrendingUp } from 'lucide-react';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { useActivePomodoro, useStartPomodoro, usePausePomodoro, useFinishPomodoro } from '@/hooks';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function PomodoroPage() {
  const { data: activePomodoro } = useActivePomodoro();
  const { mutate: startPomodoro } = useStartPomodoro();
  const { mutate: pausePomodoro } = usePausePomodoro();
  const { mutate: finishPomodoro } = useFinishPomodoro();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos default
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionCount, setSessionCount] = useState(1);

  const [todayStats, setTodayStats] = useState({
    completedPomodoros: 0,
    totalFocusTime: 0,
    completedTasks: 0,
    streak: 0
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (activePomodoro) {
      setIsRunning(true);
    } else {
      // Para demonstração, vamos usar uma tarefa mock
      startPomodoro({
        taskId: 'mock-task-id',
        duration: mode === 'work' ? 25 : mode === 'shortBreak' ? 5 : 15,
        breakTime: mode === 'work' ? 5 : 0,
      });
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
    setTimeLeft(mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60);
  };

  const handleSwitchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : newMode === 'shortBreak' ? 5 * 60 : 15 * 60);
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
        return 'bg-green-500';
      case 'longBreak':
        return 'bg-blue-500';
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
    <div className="h-full p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Timer Pomodoro</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Mantenha o foco e aumente sua produtividade
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Timer Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center">
            <CardHeader>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className={cn("text-white", getModeColor())}>
                  {getModeLabel()}
                </Badge>
                <Badge variant="secondary">
                  Sessão {sessionCount}
                </Badge>
              </div>
              {activePomodoro?.task && (
                <p className="text-sm text-muted-foreground mt-2">
                  Trabalhando em: {activePomodoro.task.title}
                </p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="relative">
                <div className="text-4xl md:text-6xl font-mono font-bold text-primary mb-4">
                  {formatTime(timeLeft)}
                </div>
                
                <div className="flex items-center justify-center gap-3 md:gap-4">
                  <Button
                    size="lg"
                    onClick={isRunning ? handlePause : handleStart}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full touch-target"
                  >
                    {isRunning ? (
                      <Pause className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <Play className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleReset}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full touch-target"
                  >
                    <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full touch-target"
                  >
                    <Settings className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 md:gap-4">
                <Button
                  variant={mode === 'work' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSwitchMode('work')}
                  className="text-xs md:text-sm touch-target"
                >
                  Foco
                </Button>
                <Button
                  variant={mode === 'shortBreak' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSwitchMode('shortBreak')}
                  className="text-xs md:text-sm touch-target"
                >
                  Pausa Curta
                </Button>
                <Button
                  variant={mode === 'longBreak' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSwitchMode('longBreak')}
                  className="text-xs md:text-sm touch-target"
                >
                  Pausa Longa
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Estatísticas do Dia */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="touch-target">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Pomodoros Hoje
                </CardTitle>
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{todayStats.completedPomodoros}</div>
                <p className="text-xs text-muted-foreground">
                  +{sessionCount} esta sessão
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="touch-target">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Tempo Focado
                </CardTitle>
                <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {Math.floor(todayStats.totalFocusTime / 60)}h {todayStats.totalFocusTime % 60}m
                </div>
                <p className="text-xs text-muted-foreground">
                  hoje
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="touch-target">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Tarefas Concluídas
                </CardTitle>
                <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{todayStats.completedTasks}</div>
                <p className="text-xs text-muted-foreground">
                  hoje
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="touch-target">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Sequência
                </CardTitle>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{todayStats.streak}</div>
                <p className="text-xs text-muted-foreground">
                  dias consecutivos
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Histórico Recente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Histórico Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 md:py-8">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm md:text-base">
                  Inicie seu primeiro pomodoro para ver o histórico aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
