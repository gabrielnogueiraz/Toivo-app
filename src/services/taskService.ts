import apiClient from './api';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  MoveTaskRequest,
  ApiResponse,
} from '@/types/board';

export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get<ApiResponse<Task[]>>('/tasks');
  return response.data.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
};

export const getTasksByColumn = async (columnId: string): Promise<Task[]> => {
  const response = await apiClient.get<ApiResponse<Task[]>>(`/tasks/column/${columnId}`);
  return response.data.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
  return response.data.data;
};

export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
  const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, data);
  return response.data.data;
};

export const moveTask = async (id: string, data: MoveTaskRequest): Promise<Task> => {
  const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/move`, data);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

export const taskService = {
  getTasks,
  getTask,
  getTasksByColumn,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
};
