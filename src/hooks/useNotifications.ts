import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { usePomodoroStore } from '@/stores';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  vibrate?: number[];
  tag?: string;
}

export const useNotifications = () => {
  const { enableNotifications, enableSounds } = usePomodoroStore();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const showNotification = useCallback(async (options: NotificationOptions) => {
    if (!enableNotifications) return;

    const hasPermission = await requestPermission();
    
    if (hasPermission) {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.png',
        tag: options.tag,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Vibration for mobile devices
      if (options.vibrate && 'vibrate' in navigator) {
        navigator.vibrate(options.vibrate);
      }

      return notification;
    }

    // Fallback para toast notification
    toast(options.title, {
      description: options.body,
      duration: 5000,
    });
  }, [enableNotifications, requestPermission]);

  const playSound = useCallback((soundType: 'start' | 'complete' | 'break' | 'error') => {
    if (!enableSounds) return;

    try {
      const audio = new Audio(`/sounds/${soundType}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(err => {
        console.warn('Não foi possível reproduzir o som:', err);
      });
    } catch (err) {
      console.warn('Erro ao tentar reproduzir som:', err);
    }
  }, [enableSounds]);

  const showPomodoroNotification = useCallback((type: 'start' | 'complete' | 'break') => {
    const notifications = {
      start: {
        title: '🍅 Pomodoro Iniciado',
        body: 'Foco total! Vamos trabalhar por 25 minutos.',
        tag: 'pomodoro-start',
      },
      complete: {
        title: '✅ Pomodoro Concluído',
        body: 'Excelente! Hora de fazer uma pausa.',
        tag: 'pomodoro-complete',
        vibrate: [200, 100, 200],
      },
      break: {
        title: '☕ Pausa Concluída',
        body: 'Descansou? Vamos para o próximo pomodoro!',
        tag: 'pomodoro-break',
      },
    };

    showNotification(notifications[type]);
    playSound(type);
  }, [showNotification, playSound]);

  const showTaskNotification = useCallback((type: 'created' | 'updated' | 'completed', taskTitle: string) => {
    const notifications = {
      created: {
        title: '📝 Tarefa Criada',
        body: `"${taskTitle}" foi adicionada ao seu board.`,
        tag: 'task-created',
      },
      updated: {
        title: '✏️ Tarefa Atualizada',
        body: `"${taskTitle}" foi modificada.`,
        tag: 'task-updated',
      },
      completed: {
        title: '🎉 Tarefa Concluída',
        body: `Parabéns! "${taskTitle}" foi finalizada.`,
        tag: 'task-completed',
        vibrate: [100, 50, 100],
      },
    };

    showNotification(notifications[type]);
  }, [showNotification]);

  // Configurar service worker para notificações em background
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('message', (event: MessageEvent) => {
          if (event.data && event.data.type === 'POMODORO_COMPLETE') {
            showPomodoroNotification('complete');
          }
        });
      });
    }
  }, [showPomodoroNotification]);

  return {
    requestPermission,
    showNotification,
    showPomodoroNotification,
    showTaskNotification,
    playSound,
  };
};
