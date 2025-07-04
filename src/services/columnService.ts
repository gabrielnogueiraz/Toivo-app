import apiClient from './api';
import {
  Column,
  CreateColumnRequest,
  UpdateColumnRequest,
  ApiResponse,
} from '@/types/board';

export const getColumn = async (id: string): Promise<Column> => {
  const response = await apiClient.get<ApiResponse<Column>>(`/columns/${id}`);
  return response.data.data;
};

export const createColumn = async (data: CreateColumnRequest): Promise<Column> => {
  const response = await apiClient.post<ApiResponse<Column>>('/columns', data);
  return response.data.data;
};

export const updateColumn = async (id: string, data: UpdateColumnRequest): Promise<Column> => {
  const response = await apiClient.patch<ApiResponse<Column>>(`/columns/${id}`, data);
  return response.data.data;
};

export const deleteColumn = async (id: string): Promise<void> => {
  await apiClient.delete(`/columns/${id}`);
};

export const columnService = {
  getColumn,
  createColumn,
  updateColumn,
  deleteColumn,
};
