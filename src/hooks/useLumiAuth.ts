import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { createLumiService } from '@/services/lumi';

export interface UseLumiAuthReturn {
  isLumiReady: boolean;
  isLoading: boolean;
  error: string | null;
  checkConnection: () => Promise<void>;
}

/**
 * Hook para gerenciar o status da autenticação e conexão com a Lumi
 */
export function useLumiAuth(): UseLumiAuthReturn {
  const [isLumiReady, setIsLumiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const checkConnection = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isAuthenticated) {
        setIsLumiReady(false);
        setError('Usuário não está autenticado no Toivo');
        return;
      }

      const lumiService = createLumiService();
      const canConnect = await lumiService.isLumiReady();
      setIsLumiReady(canConnect);

      if (!canConnect) {
        setError('Não foi possível conectar com a API da Lumi');
      }

    } catch (err: any) {
      setError(err.message || 'Erro desconhecido ao testar conexão');
      setIsLumiReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, [isAuthenticated]);

  return { isLumiReady, isLoading, error, checkConnection };
}
