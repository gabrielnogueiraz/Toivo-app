export enum TaskFlowerState {
  NOT_STARTED = 'not_started',        // 0 pomodoros
  IN_PROGRESS = 'in_progress',        // Alguns pomodoros feitos
  READY_FOR_FLOWERS = 'ready',        // Todos pomodoros feitos, não concluída
  COMPLETED_WITH_FLOWERS = 'completed_flowers',  // Concluída + flores
  COMPLETED_NO_FLOWERS = 'completed_no_flowers'  // Concluída sem flores
}

export interface TaskWithFlowerState {
  id: string;
  title: string;
  completed: boolean;
  completedPomodoros: number;
  pomodoroGoal: number;
  hasFlowers?: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const getTaskFlowerState = (task: TaskWithFlowerState): TaskFlowerState => {
  if (task.completed) {
    return task.hasFlowers ? 
      TaskFlowerState.COMPLETED_WITH_FLOWERS : 
      TaskFlowerState.COMPLETED_NO_FLOWERS;
  }
  
  if (task.completedPomodoros >= task.pomodoroGoal) {
    return TaskFlowerState.READY_FOR_FLOWERS;
  }
  
  if (task.completedPomodoros > 0) {
    return TaskFlowerState.IN_PROGRESS;
  }
  
  return TaskFlowerState.NOT_STARTED;
};

export interface TaskFlowerIndicatorConfig {
  icon: string;
  text: string;
  color: string;
  pulse?: boolean;
}

export const getTaskFlowerIndicator = (
  task: TaskWithFlowerState
): TaskFlowerIndicatorConfig => {
  const state = getTaskFlowerState(task);
  
  const indicators: Record<TaskFlowerState, TaskFlowerIndicatorConfig> = {
    [TaskFlowerState.NOT_STARTED]: {
      icon: '🌱',
      text: 'Pronta para crescer',
      color: '#94A3B8'
    },
    [TaskFlowerState.IN_PROGRESS]: {
      icon: '🌿',
      text: `${task.completedPomodoros}/${task.pomodoroGoal} pomodoros`,
      color: '#10B981'
    },
    [TaskFlowerState.READY_FOR_FLOWERS]: {
      icon: '🌺',
      text: 'Pronta para colher!',
      color: '#F59E0B',
      pulse: true
    },
    [TaskFlowerState.COMPLETED_WITH_FLOWERS]: {
      icon: '🌸',
      text: 'Flores colhidas!',
      color: '#8B5CF6'
    },
    [TaskFlowerState.COMPLETED_NO_FLOWERS]: {
      icon: '✅',
      text: 'Concluída',
      color: '#6B7280'
    }
  };
  
  return indicators[state];
};
