import apiClient, { setAuthToken, setUserData, clearAuthData } from './api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/types/auth';

const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/users/register', data);
  
  if (response.data.success && response.data.data) {
    // Armazenar token e dados do usuário
    setAuthToken(response.data.data.accessToken);
    setUserData(response.data.data.user);
    
    return {
      user: response.data.data.user,
      accessToken: response.data.data.accessToken
    };
  }
  
  throw new Error('Resposta de registro inválida');
};

const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/users/login', data);
  
  // Verifica se a resposta tem o formato esperado
  if (response.data.success && response.data.data) {
    // Armazenar token e dados do usuário
    setAuthToken(response.data.data.accessToken);
    setUserData(response.data.data.user);
    
    return {
      user: response.data.data.user,
      accessToken: response.data.data.accessToken
    };
  }
  
  throw new Error('Resposta de login inválida');
};

const logout = async (): Promise<void> => {
  try {
    // Chamar endpoint de logout para limpar refresh token no backend
    await apiClient.post('/users/logout');
  } catch (error) {
    console.error('Erro ao fazer logout no backend:', error);
  } finally {
    // Sempre limpar dados locais
    clearAuthData();
  }
};

const getMe = async (): Promise<User> => {
  const response = await apiClient.get('/users/me');
  
  if (response.data.success && response.data.data) {
    // Atualizar dados do usuário localmente
    setUserData(response.data.data);
    return response.data.data;
  }
  
  throw new Error('Erro ao obter dados do usuário');
};

const refreshToken = async (): Promise<{ accessToken: string; user: User }> => {
  const response = await apiClient.post('/users/refresh');
  
  if (response.data.success && response.data.data) {
    // Atualizar token e dados do usuário
    setAuthToken(response.data.data.accessToken);
    setUserData(response.data.data.user);
    
    return {
      accessToken: response.data.data.accessToken,
      user: response.data.data.user
    };
  }
  
  throw new Error('Erro ao renovar token');
};

export const authService = {
  register,
  login,
  logout,
  getMe,
  refreshToken,
};
