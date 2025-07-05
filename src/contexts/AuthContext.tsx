import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { authService } from '@/services/authService';
import { setAuthToken, getAuthToken, getUserData, clearAuthData } from '@/services/api';
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
      setLoading(true);
      
      // Verifica se há token e dados do usuário salvos
      const existingToken = getAuthToken();
      const savedUser = getUserData();
      
      if (existingToken && savedUser) {
        // Se há token e dados salvos, definir o usuário
        setUser(savedUser);
        
        try {
          // Tentar fazer refresh para validar/renovar o token
          const refreshResult = await authService.refreshToken();
          
          if (refreshResult.user) {
            setUser(refreshResult.user);
          }
        } catch (error) {
          console.error('Erro ao renovar token na inicialização:', error);
          // Se falhar o refresh, tentar obter dados do usuário
          try {
            const currentUser = await authService.getMe();
            setUser(currentUser);
          } catch (getMeError) {
            console.error('Erro ao obter dados do usuário:', getMeError);
            // Token inválido, limpar dados
            clearAuthData();
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('Erro na inicialização da autenticação:', error);
      clearAuthData();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
    
    // Aplicar tema salvo no localStorage se existir
    const savedTheme = localStorage.getItem('userTheme') as 'default' | 'dark' | 'zen' | null;
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, [initializeAuth]);

  const handleAuthSuccess = (response: { user: User; accessToken: string }) => {
    setAuthToken(response.accessToken);
    setUser(response.user);
    
    // Aplicar tema do usuário se existir
    if (response.user.theme) {
      applyTheme(response.user.theme);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Aplicar tema atualizado
    if (updatedUser.theme) {
      applyTheme(updatedUser.theme);
    }
  };

  const applyTheme = (theme: 'default' | 'dark' | 'zen') => {
    const body = document.body;
    body.classList.remove('theme-default', 'theme-dark', 'theme-zen');
    body.classList.add(`theme-${theme}`);
    localStorage.setItem('userTheme', theme);
  };

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      handleAuthSuccess(response);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      handleAuthSuccess(response);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      clearAuthData();
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
