import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedTimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
  className?: string;
}

export function EnhancedTimerDisplay({
  timeLeft,
  totalTime,
  isRunning,
  mode,
  onStart,
  onPause,
  onReset,
  onOpenSettings,
  className
}: EnhancedTimerDisplayProps) {
  const [isHovered, setIsHovered] = useState(false);
  const progress = totalTime > 0 ? 1 - (timeLeft / totalTime) : 0;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Formatar tempo
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Configurações de estilo baseadas no modo
  const modeConfig = {
    work: {
      label: 'Foco',
      emoji: '🎯',
      primaryColor: 'bg-primary',
      textColor: 'text-primary',
      bgColor: 'bg-primary/10',
      strokeColor: 'stroke-primary'
    },
    shortBreak: {
      label: 'Pausa',
      emoji: '☕',
      primaryColor: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      strokeColor: 'stroke-emerald-500'
    },
    longBreak: {
      label: 'Descanso',
      emoji: '🌟',
      primaryColor: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      strokeColor: 'stroke-purple-500'
    }
  };

  const config = modeConfig[mode];

  return (
    <div className={cn("flex flex-col items-center space-y-8", className)}>
      {/* Timer circular principal */}
      <motion.div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Glow effect */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-0 transition-opacity duration-500",
            "shadow-primary/25"
          )}
          animate={{ 
            opacity: isRunning ? 0.6 : 0,
            scale: isRunning ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Container do SVG */}
        <div className="relative">
          <svg
            width="320"
            height="320"
            className="transform -rotate-90 drop-shadow-lg"
          >
            {/* Círculo de fundo */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            
            {/* Círculo de progresso */}
            <motion.circle
              cx="160"
              cy="160"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            
            {/* Gradiente dinâmico */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={config.textColor} />
                <stop offset="100%" className={config.textColor} />
              </linearGradient>
            </defs>
          </svg>

          {/* Conteúdo central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Emoji do modo */}
            <motion.div
              className="text-3xl mb-2"
              animate={{ 
                scale: isRunning ? [1, 1.1, 1] : 1,
                rotate: isRunning ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: 2,
                repeat: isRunning ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              {config.emoji}
            </motion.div>
            
            {/* Tempo principal */}
            <motion.div
              className={cn("text-4xl md:text-5xl font-mono font-bold", config.textColor)}
              animate={{ 
                scale: timeLeft <= 60 && timeLeft > 0 ? [1, 1.05, 1] : 1 
              }}
              transition={{ 
                duration: 1,
                repeat: timeLeft <= 60 && timeLeft > 0 ? Infinity : 0
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>
            
            {/* Label do modo */}
            <div className={cn("text-sm md:text-base font-medium mt-2", config.textColor)}>
              {config.label}
            </div>
            
            {/* Progresso percentual */}
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {Math.round(progress * 100)}% concluído
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controles elegantes */}
      <div className="flex items-center space-x-6">
        {/* Botão de configurações */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenSettings}
            className="h-12 w-12 rounded-full border-2 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Botão principal play/pause */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={isRunning ? onPause : onStart}
            className={cn(
              "h-20 w-20 rounded-full text-white text-lg font-medium shadow-xl transition-all duration-300",
              config.primaryColor,
              "hover:shadow-2xl hover:shadow-primary/25",
              "relative overflow-hidden"
            )}
          >
            {/* Efeito de pulse quando rodando */}
            {isRunning && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            
            {isRunning ? (
              <Pause className="h-8 w-8 relative z-10" />
            ) : (
              <Play className="h-8 w-8 ml-1 relative z-10" />
            )}
          </Button>
        </motion.div>

        {/* Botão de reset */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="h-12 w-12 rounded-full border-2 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      {/* Indicador de progresso linear sutil */}
      <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", config.primaryColor)}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
