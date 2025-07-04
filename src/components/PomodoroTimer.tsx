import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Minimize2, Maximize2, X, Volume2, VolumeX } from 'lucide-react';
import { useActivePomodoro, usePomodoroTimer, useStartPomodoro, usePausePomodoro, useResumePomodoro, useFinishPomodoro, useNotifications, usePomodoroSync } from '@/hooks';
import { usePomodoroStore } from '@/stores';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function PomodoroTimer() {
  const { data: activePomodoro } = useActivePomodoro();
  const { mutate: pausePomodoro } = usePausePomodoro();
  const { mutate: resumePomodoro } = useResumePomodoro();
  const { mutate: finishPomodoro } = useFinishPomodoro();
  
  // Usar o hook de sincronização inteligente
  usePomodoroSync();
  
  const {
    isVisible,
    isMinimized,
    isFullscreen,
    enableSounds,
    setTimerVisibility,
    setTimerMinimized,
    setTimerFullscreen,
    setEnableSounds,
    incrementSessionsCompleted,
    addFocusTime,
  } = usePomodoroStore();

  const timer = usePomodoroTimer(activePomodoro);
  const { showPomodoroNotification } = useNotifications();
  
  const [prevTimeLeft, setPrevTimeLeft] = useState(timer.timeLeft);

  useEffect(() => {
    if (activePomodoro) {
      setTimerVisibility(true);
    } else {
      setTimerVisibility(false);
    }
  }, [activePomodoro, setTimerVisibility]);

  useEffect(() => {
    if (prevTimeLeft > 0 && timer.timeLeft === 0 && timer.isCompleted) {
      showPomodoroNotification('complete');
      incrementSessionsCompleted();
      addFocusTime(activePomodoro?.duration || 0);
      
      if (activePomodoro) {
        finishPomodoro(activePomodoro.id);
      }
    }
    setPrevTimeLeft(timer.timeLeft);
  }, [timer.timeLeft, timer.isCompleted, prevTimeLeft, activePomodoro, finishPomodoro, showPomodoroNotification, incrementSessionsCompleted, addFocusTime]);

  const handlePlayPause = () => {
    if (!activePomodoro) return;

    if (activePomodoro.status === 'IN_PROGRESS') {
      pausePomodoro(activePomodoro.id);
    } else if (activePomodoro.status === 'PAUSED') {
      resumePomodoro(activePomodoro.id);
    }
  };

  const handleStop = () => {
    if (activePomodoro) {
      finishPomodoro(activePomodoro.id);
    }
  };

  const handleClose = () => {
    setTimerVisibility(false);
  };

  const toggleMinimize = () => {
    setTimerMinimized(!isMinimized);
  };

  const toggleFullscreen = () => {
    setTimerFullscreen(!isFullscreen);
  };

  const toggleSound = () => {
    setEnableSounds(!enableSounds);
  };

  if (!isVisible || !activePomodoro) {
    return null;
  }

  const CircularProgress = () => (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset="100"
          className="text-muted stroke-2"
        />
        <motion.path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary"
          strokeDasharray="100"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 100 - timer.progress * 100 }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{timer.formattedTime}</div>
          <div className="text-xs text-muted-foreground">
            {activePomodoro.status === 'PAUSED' ? 'Pausado' : 'Focando'}
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
      >
        <Card className="p-12 text-center">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Modo Foco</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleSound}>
                {enableSounds ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <CircularProgress />
          </div>

          {activePomodoro.task && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">{activePomodoro.task.title}</h3>
              {activePomodoro.task.description && (
                <p className="text-muted-foreground">{activePomodoro.task.description}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full"
            >
              {activePomodoro.status === 'IN_PROGRESS' ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleStop}
              className="w-16 h-16 rounded-full"
            >
              <Square className="w-6 h-6" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Card className="p-4 min-w-64 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Pomodoro Ativo</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={toggleMinimize}>
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold">{timer.formattedTime}</div>
              <Badge variant={activePomodoro.status === 'PAUSED' ? 'secondary' : 'default'}>
                {activePomodoro.status === 'PAUSED' ? 'Pausado' : 'Focando'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Button size="sm" onClick={handlePlayPause}>
                {activePomodoro.status === 'IN_PROGRESS' ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleStop}>
                <Square className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <Progress value={timer.progress * 100} className="mt-3 h-1" />
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Card className="p-6 min-w-80 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pomodoro Timer</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={toggleSound}>
              {enableSounds ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleMinimize}>
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-3xl font-bold mb-1">{timer.formattedTime}</div>
          <Badge variant={activePomodoro.status === 'PAUSED' ? 'secondary' : 'default'}>
            {activePomodoro.status === 'PAUSED' ? 'Pausado' : 'Focando'}
          </Badge>
        </div>

        {activePomodoro.task && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-1">{activePomodoro.task.title}</h4>
            {activePomodoro.task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {activePomodoro.task.description}
              </p>
            )}
          </div>
        )}

        <Progress value={timer.progress * 100} className="mb-4 h-2" />

        <div className="flex items-center justify-center gap-3">
          <Button onClick={handlePlayPause}>
            {activePomodoro.status === 'IN_PROGRESS' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Continuar
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleStop}>
            <Square className="w-4 h-4 mr-2" />
            Parar
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
