import apiClient from './api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/types/auth';

const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/users/register', data);
  return response.data;
};

const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/users/login', data);
  return response.data;
};

const logout = async (): Promise<void> => {
  // O backend limpa o cookie httpOnly. Não é necessário verificar a resposta.
  await apiClient.post('/users/logout');
};

const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
};

const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await apiClient.post<{ accessToken: string }>('/users/refresh-token');
  return response.data;
};

export const authService = {
  register,
  login,
  logout,
  getMe,
  refreshToken,
};
