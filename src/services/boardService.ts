import apiClient from './api';
import {
  Board,
  CreateBoardRequest,
  UpdateBoardRequest,
  ApiResponse,
} from '@/types/board';

export const getBoards = async (): Promise<Board[]> => {
  const response = await apiClient.get<ApiResponse<Board[]>>('/boards');
  return response.data.data;
};

export const getBoard = async (id: string): Promise<Board> => {
  const response = await apiClient.get<ApiResponse<Board>>(`/boards/${id}`);
  return response.data.data;
};

export const createBoard = async (data: CreateBoardRequest): Promise<Board> => {
  const response = await apiClient.post<ApiResponse<Board>>('/boards', data);
  return response.data.data;
};

export const updateBoard = async (id: string, data: UpdateBoardRequest): Promise<Board> => {
  const response = await apiClient.put<ApiResponse<Board>>(`/boards/${id}`, data);
  return response.data.data;
};

export const deleteBoard = async (id: string): Promise<void> => {
  await apiClient.delete(`/boards/${id}`);
};

export const boardService = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};
