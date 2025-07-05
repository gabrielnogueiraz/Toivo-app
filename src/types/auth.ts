// Interfaces para as respostas da API

export interface User {
  id: string;
  name: string;
  email: string;
  theme?: 'default' | 'dark' | 'zen';
  profileImage?: string | null;
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

export type UpdateProfileRequest = {
  name?: string;
  email?: string;
};

export type UpdateAvatarRequest = {
  profileImage: string;
};

export type UpdateThemeRequest = {
  theme: 'default' | 'dark' | 'zen';
};

// Interface para o estado do contexto de autenticação

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
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

export interface SearchUsersResponse {
  users: User[];
}
