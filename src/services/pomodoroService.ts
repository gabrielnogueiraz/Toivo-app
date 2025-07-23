import apiClient from './api';
import {
  Pomodoro,
  StartPomodoroRequest,
  ApiResponse,
  PomodoroTask,
} from '@/types/board';

// Interfaces para a nova funcionalidade de seleção de tarefas
export interface PomodoroTasksParams {
  boardId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  search?: string;
  completed?: boolean;
}

export interface PomodoroTasksResponse {
  tasks: PomodoroTask[];
}

// Interfaces para configurações de pomodoro
export interface PomodoroSettings {
  id: string;
  focusDuration: number;
  shortBreakTime: number;
  longBreakTime: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePomodoroSettingsRequest {
  focusDuration?: number;
  shortBreakTime?: number;
  longBreakTime?: number;
}

export const getPomodoros = async (): Promise<Pomodoro[]> => {
  const response = await apiClient.get<ApiResponse<Pomodoro[]>>('/pomodoros');
  return response.data.data;
};

export const getPomodoro = async (id: string): Promise<Pomodoro> => {
  const response = await apiClient.get<ApiResponse<Pomodoro>>(`/pomodoro/${id}`);
  return response.data.data;
};

export const getActivePomodoro = async (): Promise<Pomodoro | null> => {
  const response = await apiClient.get<ApiResponse<Pomodoro | null>>('/pomodoro/active');
  return response.data.data;
};

export const startPomodoro = async (data: StartPomodoroRequest): Promise<Pomodoro> => {
  const response = await apiClient.post<ApiResponse<Pomodoro>>('/pomodoro/start', data);
  return response.data.data;
};

export const pausePomodoro = async (id: string): Promise<Pomodoro> => {
  const response = await apiClient.post<ApiResponse<Pomodoro>>(`/pomodoro/${id}/pause`);
  return response.data.data;
};

export const resumePomodoro = async (id: string): Promise<Pomodoro> => {
  const response = await apiClient.post<ApiResponse<Pomodoro>>(`/pomodoro/${id}/resume`);
  return response.data.data;
};

export const finishPomodoro = async (id: string): Promise<Pomodoro> => {
  const response = await apiClient.post<ApiResponse<Pomodoro>>(`/pomodoro/${id}/finish`);
  return response.data.data;
};

export const getPomodoroTasks = async (params?: PomodoroTasksParams): Promise<PomodoroTask[]> => {
  const searchParams = new URLSearchParams();
  
  if (params?.boardId) searchParams.append('boardId', params.boardId);
  if (params?.priority) searchParams.append('priority', params.priority);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.completed !== undefined) searchParams.append('completed', params.completed.toString());

  const url = `/pomodoro/tasks${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await apiClient.get<ApiResponse<PomodoroTasksResponse>>(url);
  return response.data.data.tasks;
};

export const getPomodoroSettings = async (): Promise<PomodoroSettings> => {
  const response = await apiClient.get<ApiResponse<PomodoroSettings>>('/pomodoro/settings');
  return response.data.data;
};

export const updatePomodoroSettings = async (data: UpdatePomodoroSettingsRequest): Promise<PomodoroSettings> => {
  const response = await apiClient.put<ApiResponse<PomodoroSettings>>('/pomodoro/settings', data);
  return response.data.data;
};

export const pomodoroService = {
  getPomodoros,
  getPomodoro,
  getActivePomodoro,
  startPomodoro,
  pausePomodoro,
  resumePomodoro,
  finishPomodoro,
  getPomodoroTasks,
  getPomodoroSettings,
  updatePomodoroSettings,
};
