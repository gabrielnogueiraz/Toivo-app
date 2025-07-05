import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { authService } from '@/services/authService';
import { setAuthToken, getAuthToken } from '@/services/api';
import { User, LoginRequest, RegisterRequest, AuthContextType } from '@/types/auth';

// Um componente de loading simples para exibir enquanto verifica o status da autenticação
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
  </div>
);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    try {
      // Verifica se há token no localStorage
      const existingToken = getAuthToken();
      
      if (existingToken) {
        // Se há token, tenta obter dados do usuário
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
          setLoading(false);
          return;
        } catch (error) {
          // Token inválido, limpa o localStorage
          setAuthToken(null);
        }
      }
    } catch (error) {
      console.error('Erro na inicialização da autenticação:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleAuthSuccess = (response: { user: User; accessToken: string }) => {
    setAuthToken(response.accessToken);
    setUser(response.user);
  };

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    handleAuthSuccess(response);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    handleAuthSuccess(response);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      setAuthToken(null);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
