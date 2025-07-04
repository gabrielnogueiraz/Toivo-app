import apiClient from './api';
import {
  Pomodoro,
  StartPomodoroRequest,
  ApiResponse,
} from '@/types/board';

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

export const pomodoroService = {
  getPomodoros,
  getPomodoro,
  getActivePomodoro,
  startPomodoro,
  pausePomodoro,
  resumePomodoro,
  finishPomodoro,
};
