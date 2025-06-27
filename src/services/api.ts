import axios, { AxiosInstance, AxiosResponse } from 'axios';

declare global {
  interface ImportMetaEnv {
    VITE_API_URL: string;
  }

  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
