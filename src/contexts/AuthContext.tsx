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
    console.log('AuthContext - Inicializando autenticação...');
    
    try {
      // Primeiro verifica se há token no localStorage
      const existingToken = getAuthToken();
      
      if (existingToken) {
        console.log('Token encontrado no localStorage, verificando validade...');
        // Se há token, tenta obter dados do usuário
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
          console.log('Usuário autenticado com sucesso:', currentUser);
          setLoading(false);
          return;
        } catch (error) {
          console.log('Token inválido, limpando...');
          setAuthToken(null);
        }
      }
      
      console.log('Nenhum token válido encontrado');
    } catch (error) {
      console.log('Erro na inicialização da autenticação:', error);
    } finally {
      setLoading(false);
    }
    
    console.log('AuthContext - Inicialização concluída');
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleAuthSuccess = (response: { user: User; accessToken: string }) => {
    console.log('AuthContext - handleAuthSuccess chamado:', response);
    setAuthToken(response.accessToken);
    setUser(response.user);
  };

  const login = async (data: LoginRequest) => {
    console.log('AuthContext - Iniciando login...');
    const response = await authService.login(data);
    console.log('AuthContext - Login response:', response);
    handleAuthSuccess(response);
    console.log('AuthContext - Login concluído, user:', response.user);
  };

  const register = async (data: RegisterRequest) => {
    console.log('AuthContext - Iniciando register...');
    const response = await authService.register(data);
    console.log('AuthContext - Register response:', response);
    handleAuthSuccess(response);
    console.log('AuthContext - Register concluído, user:', response.user);
  };

  const logout = async () => {
    console.log('AuthContext - Iniciando logout...');
    try {
      await authService.logout();
      console.log('AuthContext - Logout API bem-sucedido');
    } catch (error) {
      console.error('AuthContext - Falha na requisição de logout:', error);
    } finally {
      setUser(null);
      setAuthToken(null);
      console.log('AuthContext - Estado de logout aplicado');
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
