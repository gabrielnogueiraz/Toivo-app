// Interfaces para as respostas da API

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Interfaces para as requisições (payloads)

export type RegisterRequest = Pick<User, 'name' | 'email'> & {
  password: string;
};

export type LoginRequest = Pick<User, 'email'> & {
  password: string;
};

// Interface para o estado do contexto de autenticação

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// Tipos para erros da API

export interface ApiErrorData {
  message: string;
  code?: string;
}

export interface ApiError {
  success: false;
  error: ApiErrorData;
}
