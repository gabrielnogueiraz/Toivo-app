import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createLumiService, LumiService } from '@/services/lumi';
import { getAuthToken } from '@/services/api';
import { LumiMemory, LumiContextResponse } from '@/types/lumi';

interface LumiContextType {
  lumiService: LumiService | null;
  isConnected: boolean;
  userContext: LumiContextResponse | null;
  memories: LumiMemory[];
  insights: LumiMemory[];
  loading: boolean;
  error: string | null;
  refreshContext: () => Promise<void>;
  refreshMemories: () => Promise<void>;
  refreshInsights: () => Promise<void>;
}

const LumiContext = createContext<LumiContextType | undefined>(undefined);

interface LumiProviderProps {
  children: ReactNode;
}

export const LumiProvider: React.FC<LumiProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Estados
  const [lumiService, setLumiService] = useState<LumiService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userContext, setUserContext] = useState<LumiContextResponse | null>(null);
  const [memories, setMemories] = useState<LumiMemory[]>([]);
  const [insights, setInsights] = useState<LumiMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar serviço da Lumi
  useEffect(() => {
    const token = getAuthToken();
    
    if (token && user) {
      console.log('🚀 Inicializando serviço da Lumi para usuário:', user.name);
      const service = createLumiService();
      setLumiService(service);
      checkConnection(service);
    } else {
      console.log('👤 Usuário não autenticado - serviço Lumi não iniciado');
      setLumiService(null);
      setIsConnected(false);
    }
  }, [user]);

  // Verificar conexão com a API da Lumi
  const checkConnection = async (service: LumiService) => {
    try {
      console.log('🔗 Verificando conexão com Lumi...');
      setLoading(true);
      setError(null);
      
      const isReady = await service.isLumiReady();
      setIsConnected(isReady);
      
      if (isReady) {
        console.log('✅ Conexão com Lumi estabelecida');
        await loadInitialData(service);
      } else {
        console.warn('⚠️ Lumi não está pronta');
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com Lumi:', error);
      setIsConnected(false);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais (mais tolerante a erros)
  const loadInitialData = async (service: LumiService) => {
    try {
      console.log('📥 Carregando dados iniciais...');
      
      // Tentar carregar contexto (não crítico)
      try {
        const context = await service.getUserContext();
        setUserContext(context);
        console.log('✅ Contexto do usuário carregado');
      } catch (error) {
        console.warn('⚠️ Falha ao carregar contexto:', error);
      }

      // Tentar carregar memórias (não crítico, com menos itens)
      try {
        const userMemories = await service.getUserMemories(undefined, 5);
        setMemories(userMemories);
        console.log('✅ Memórias carregadas:', userMemories.length);
      } catch (error) {
        console.warn('⚠️ Falha ao carregar memórias:', error);
        setMemories([]);
      }

      // Tentar carregar insights (não crítico)
      try {
        const productivityInsights = await service.getProductivityInsights();
        setInsights(productivityInsights);
        console.log('✅ Insights carregados:', productivityInsights.length);
      } catch (error) {
        console.warn('⚠️ Falha ao carregar insights:', error);
        setInsights([]);
      }

    } catch (error) {
      console.error('❌ Erro no carregamento inicial:', error);
      // Não definir como erro crítico - a Lumi pode funcionar mesmo sem dados iniciais
    }
  };

  // Funções de atualização
  const refreshContext = async () => {
    if (!lumiService) return;

    try {
      const context = await lumiService.getUserContext();
      setUserContext(context);
      console.log('✅ Contexto atualizado');
    } catch (error) {
      console.error('❌ Erro ao atualizar contexto:', error);
    }
  };

  const refreshMemories = async () => {
    if (!lumiService) return;

    try {
      const newMemories = await lumiService.getUserMemories(undefined, 10);
      setMemories(newMemories);
      console.log('✅ Memórias atualizadas:', newMemories.length);
    } catch (error) {
      console.error('❌ Erro ao atualizar memórias:', error);
    }
  };

  const refreshInsights = async () => {
    if (!lumiService) return;

    try {
      const newInsights = await lumiService.getProductivityInsights();
      setInsights(newInsights);
      console.log('✅ Insights atualizados:', newInsights.length);
    } catch (error) {
      console.error('❌ Erro ao atualizar insights:', error);
    }
  };

  const value: LumiContextType = {
    lumiService,
    isConnected,
    userContext,
    memories,
    insights,
    loading,
    error,
    refreshContext,
    refreshMemories,
    refreshInsights,
  };

  return (
    <LumiContext.Provider value={value}>
      {children}
    </LumiContext.Provider>
  );
};

export const useLumiContext = (): LumiContextType => {
  const context = useContext(LumiContext);
  if (context === undefined) {
    throw new Error('useLumiContext must be used within a LumiProvider');
  }
  return context;
};

// Alias para compatibilidade
export const useLumi = useLumiContext;
