export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type PomodoroStatus = 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  startAt?: string;
  endAt?: string;
  pomodoroGoal: number;
  columnId: string;
  order: number;
  pomodoros: Pomodoro[];
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipo específico para tarefas retornadas pela API de pomodoro
export interface PomodoroTask extends Task {
  board?: {
    id: string;
    title: string;
  };
  column?: {
    id: string;
    title: string;
  };
  completedPomodoros?: number;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  boardId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  userId: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Pomodoro {
  id: string;
  duration: number;
  breakTime: number;
  status: PomodoroStatus;
  startedAt: string;
  pausedAt?: string;
  completedAt?: string;
  taskId: string;
  task?: Task;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardRequest {
  title: string;
}

export interface UpdateBoardRequest {
  title?: string;
}

export interface CreateColumnRequest {
  title: string;
  boardId: string;
  order?: number;
}

export interface UpdateColumnRequest {
  title?: string;
  order?: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  startAt?: string;
  endAt?: string;
  pomodoroGoal: number;
  columnId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  startAt?: string;
  endAt?: string;
  pomodoroGoal?: number;
}

export interface MoveTaskRequest {
  columnId: string;
}

export interface StartPomodoroRequest {
  taskId: string;
  duration: number;
  breakTime: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
