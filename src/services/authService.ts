import apiClient from './api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/types/auth';

const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/users/register', data);
  console.log('AuthService - Register response:', response.data);
  return response.data.data; // A API retorna { success: true, data: { user, token } }
};

const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/users/login', data);
  console.log('AuthService - Login response:', response.data);
  return {
    user: response.data.data.user,
    accessToken: response.data.data.token
  };
};

const logout = async (): Promise<void> => {
  await apiClient.post('/users/logout');
};

const getMe = async (): Promise<User> => {
  const response = await apiClient.get('/users/me');
  console.log('AuthService - GetMe response:', response.data);
  return response.data.data;
};

const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await apiClient.post('/users/refresh-token');
  console.log('AuthService - RefreshToken response:', response.data);
  return {
    accessToken: response.data.data.accessToken || response.data.accessToken
  };
};

export const authService = {
  register,
  login,
  logout,
  getMe,
  refreshToken,
};
