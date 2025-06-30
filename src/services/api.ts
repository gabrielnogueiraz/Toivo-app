import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Armazenamento em memória para o access token
let accessToken: string | null = null;

/**
 * Define o token de autenticação para as requisições da API.
 * @param token O token de acesso JWT ou nulo para limpá-lo.
 */
export const setAuthToken = (token: string | null) => {
  accessToken = token;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // Envia cookies (como o refreshToken) em requisições para o mesmo domínio
  withCredentials: true,
});

// Interceptor de requisição para injetar o token JWT no cabeçalho Authorization
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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

      try {
        // Tenta obter um novo access token usando o refresh token (enviado no cookie httpOnly)
        const { data } = await apiClient.post('/users/refresh-token');
        const newAccessToken = data.accessToken;
        
        setAuthToken(newAccessToken); // Armazena o novo token em memória

        // Atualiza o cabeçalho Authorization da requisição original falha
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Tenta novamente a requisição original com o novo token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Se a renovação do token falhar, limpa o token e desloga o usuário
        setAuthToken(null);
        return Promise.reject(refreshError);
      }
    }

    // Para todos os outros erros, rejeita a promise
    return Promise.reject(error);
  }
);

export default apiClient;
