import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const TOKEN_KEY = 'toivo_access_token';

/**
 * Define o token de autenticação para as requisições da API.
 * @param token O token de acesso JWT ou nulo para limpá-lo.
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Obtém o token de autenticação do localStorage.
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Armazena dados do usuário no localStorage.
 */
export const setUserData = (user: any) => {
  localStorage.setItem('toivo_user', JSON.stringify(user));
};

/**
 * Obtém dados do usuário do localStorage.
 */
export const getUserData = () => {
  const userData = localStorage.getItem('toivo_user');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Limpa todos os dados de autenticação.
 */
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('toivo_user');
};

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // Envia cookies (como o refreshToken) em requisições para o mesmo domínio
  withCredentials: true,
});

// Variável para controlar refresh simultâneo
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Função para renovar o token usando refresh token
 */
const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = performRefresh();
  
  try {
    const newToken = await refreshPromise;
    return newToken;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

const performRefresh = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/users/refresh`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;

    if (result.success && result.data.accessToken) {
      // Atualizar tokens localmente
      setAuthToken(result.data.accessToken);
      setUserData(result.data.user);
      
      return result.data.accessToken;
    }

    return null;
  } catch (error) {
    console.error('Refresh token error:', error);
    clearAuthData();
    return null;
  }
};

// Interceptor de requisição para injetar o token JWT no cabeçalho Authorization
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para lidar com a renovação automática de token
apiClient.interceptors.response.use(
  (response) => response, // Passa as respostas de sucesso
  async (error) => {
    const originalRequest = error.config;

    // Verifica se o erro é 401 Unauthorized e a requisição ainda não foi tentada novamente
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição para evitar loops infinitos

      // Não tentar refresh em rotas de login/refresh
      if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh')) {
        return Promise.reject(error);
      }

      try {
        const newToken = await refreshToken();
        
        if (newToken) {
          // Atualiza o cabeçalho Authorization da requisição original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Tenta novamente a requisição original com o novo token
          return apiClient(originalRequest);
        } else {
          // Se não conseguiu renovar o token, redireciona para login
          clearAuthData();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Se a renovação do token falhar, limpa os dados e redireciona
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Para todos os outros erros, rejeita a promise
    return Promise.reject(error);
  }
);

export default apiClient;
