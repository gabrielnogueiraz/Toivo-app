import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createLumiService, LumiService } from '@/services/lumi';
import { createLumiServiceWithFallback } from '@/services/lumi/mockLumiService';
import { getAuthToken } from '@/services/api';
import { LumiMemory, LumiContextResponse } from '@/types/lumi';

interface LumiContextType {
  lumiService: LumiService | any;
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
  const [lumiService, setLumiService] = useState<LumiService | any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userContext, setUserContext] = useState<LumiContextResponse | null>(null);
  const [memories, setMemories] = useState<LumiMemory[]>([]);
  const [insights, setInsights] = useState<LumiMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar serviço da Lumi
  useEffect(() => {
    // Verifica se há token de autenticação disponível
    const token = getAuthToken();
    
    if (token) {
      // Usuário autenticado - usar serviço real ou mock conforme configuração
      const service = createLumiServiceWithFallback();
      setLumiService(service);
      checkConnection(service);
    } else {
      // Usuário não autenticado
      setLumiService(null);
      setIsConnected(false);
    }
  }, [user?.id]); // Monitora mudanças no usuário

  // Verificar conexão
  const checkConnection = async (service: LumiService | any) => {
    try {
      const isHealthy = await service.checkHealth();
      setIsConnected(isHealthy);
      
      if (isHealthy) {
        // Carregar dados iniciais
        await loadInitialData(service);
      }
    } catch (error) {
      setIsConnected(false);
      setError('Não foi possível conectar com a Lumi');
      console.error('Erro ao verificar conexão:', error);
    }
  };

  // Carregar dados iniciais
  const loadInitialData = async (service: LumiService | any) => {
    setLoading(true);
    setError(null);

    try {
      const [contextData, memoriesData, insightsData] = await Promise.allSettled([
        service.getUserContext(),
        service.getUserMemories(undefined, 20),
        service.getProductivityInsights(),
      ]);

      // Processar contexto
      if (contextData.status === 'fulfilled' && contextData.value) {
        setUserContext(contextData.value);
      }

      // Processar memórias
      if (memoriesData.status === 'fulfilled') {
        setMemories(memoriesData.value);
      }

      // Processar insights
      if (insightsData.status === 'fulfilled') {
        setInsights(insightsData.value);
      }
    } catch (error) {
      setError('Erro ao carregar dados da Lumi');
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar contexto do usuário
  const refreshContext = async () => {
    if (!lumiService) return;

    try {
      const context = await lumiService.getUserContext();
      setUserContext(context);
    } catch (error) {
      console.error('Erro ao atualizar contexto:', error);
    }
  };

  // Atualizar memórias
  const refreshMemories = async () => {
    if (!lumiService) return;

    try {
      const newMemories = await lumiService.getUserMemories(undefined, 20);
      setMemories(newMemories);
    } catch (error) {
      console.error('Erro ao atualizar memórias:', error);
    }
  };

  // Atualizar insights
  const refreshInsights = async () => {
    if (!lumiService) return;

    try {
      const newInsights = await lumiService.getProductivityInsights();
      setInsights(newInsights);
    } catch (error) {
      console.error('Erro ao atualizar insights:', error);
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
    throw new Error('useLumiContext deve ser usado dentro de um LumiProvider');
  }
  return context;
};

export default LumiContext;
