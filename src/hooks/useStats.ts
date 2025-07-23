import { useState, useEffect, useCallback, useRef } from 'react';
import statsService, {
  OverviewStats,
  TasksByPeriod,
  SummaryStats,
  ProductivityData,
  ComparisonStats,
  formatFocusTime,
  getPeriodDates
} from '../services/statsService';

// ========== INTERFACES ==========

interface UseStatsState {
  overview: OverviewStats | null;
  tasks: TasksByPeriod | null;
  summary: SummaryStats | null;
  productivity: ProductivityData | null;
  comparison: ComparisonStats | null;
}

interface UseStatsLoadingState {
  overview: boolean;
  tasks: boolean;
  summary: boolean;
  productivity: boolean;
  comparison: boolean;
  dashboard: boolean;
}

interface UseStatsErrorState {
  overview: string | null;
  tasks: string | null;
  summary: string | null;
  productivity: string | null;
  comparison: string | null;
  dashboard: string | null;
}

export interface UseStatsReturn {
  // Estados de dados
  data: UseStatsState;
  loading: UseStatsLoadingState;
  errors: UseStatsErrorState;
  
  // Flags de estado
  hasData: boolean;
  hasErrors: boolean;
  isLoadingAny: boolean;
  
  // Funções de carregamento
  loadOverview: () => Promise<void>;
  loadTasks: (includeIncomplete?: boolean) => Promise<void>;
  loadSummary: () => Promise<void>;
  loadProductivity: (startDate: string, endDate: string) => Promise<void>;
  loadComparison: () => Promise<void>;
  loadDashboard: () => Promise<void>;
  loadAll: () => Promise<void>;
  
  // Utilitários
  refresh: () => Promise<void>;
  clearErrors: () => void;
  formatTime: (minutes: number) => string;
  getPeriodData: (period: 'week' | 'month' | 'quarter' | 'year') => { startDate: string; endDate: string };
}

// ========== HOOK PRINCIPAL ==========

export const useStats = (): UseStatsReturn => {
  // Estados de dados
  const [data, setData] = useState<UseStatsState>({
    overview: null,
    tasks: null,
    summary: null,
    productivity: null,
    comparison: null,
  });

  // Estados de loading
  const [loading, setLoading] = useState<UseStatsLoadingState>({
    overview: false,
    tasks: false,
    summary: false,
    productivity: false,
    comparison: false,
    dashboard: false,
  });

  // Estados de erro
  const [errors, setErrors] = useState<UseStatsErrorState>({
    overview: null,
    tasks: null,
    summary: null,
    productivity: null,
    comparison: null,
    dashboard: null,
  });

  // Ref para controlar re-execuções
  const mountedRef = useRef(true);

  // ========== HELPER FUNCTIONS ==========

  const setLoadingState = useCallback((key: keyof UseStatsLoadingState, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  const setErrorState = useCallback((key: keyof UseStatsErrorState, value: string | null) => {
    setErrors(prev => ({ ...prev, [key]: value }));
  }, []);

  const setDataState = useCallback((key: keyof UseStatsState, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  // ========== FUNÇÕES DE CARREGAMENTO ==========

  const loadOverview = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoadingState('overview', true);
    setErrorState('overview', null);

    try {
      const overviewData = await statsService.getOverviewStats();
      if (mountedRef.current) {
        setDataState('overview', overviewData);
      }
    } catch (error: any) {
      if (mountedRef.current) {
        setErrorState('overview', error.message);
        console.error('❌ Erro ao carregar overview:', error);
      }
    } finally {
      if (mountedRef.current) {
        setLoadingState('overview', false);
      }
    }
  }, [setLoadingState, setErrorState, setDataState]);

  const loadTasks = useCallback(async (includeIncomplete: boolean = false) => {
    if (!mountedRef.current) return;

    setLoadingState('tasks', true);
    setErrorState('tasks', null);

    try {
      const tasksData = await statsService.getTasksByPeriod(includeIncomplete);
      if (mountedRef.current) {
        setDataState('tasks', tasksData);
      }
    } catch (error: any) {
      if (mountedRef.current) {
        setErrorState('tasks', error.message);
        console.error('❌ Erro ao carregar tarefas:', error);
      }
    } finally {
      if (mountedRef.current) {
        setLoadingState('tasks', false);
      }
    }
  }, [setLoadingState, setErrorState, setDataState]);

  const loadSummary = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoadingState('summary', true);
    setErrorState('summary', null);

    try {
      const summaryData = await statsService.getSummaryStats();
      if (mountedRef.current) {
        setDataState('summary', summaryData);
      }
    } catch (error: any) {
      if (mountedRef.current) {
        setErrorState('summary', error.message);
        console.error('❌ Erro ao carregar summary:', error);
      }
    } finally {
      if (mountedRef.current) {
        setLoadingState('summary', false);
      }
    }
  }, [setLoadingState, setErrorState, setDataState]);

  const loadProductivity = useCallback(async (startDate: string, endDate: string) => {
    if (!mountedRef.current) return;

    setLoadingState('productivity', true);
    setErrorState('productivity', null);

    try {
      const productivityData = await statsService.getProductivityData(startDate, endDate);
      if (mountedRef.current) {
        setDataState('productivity', productivityData);
      }
    } catch (error: any) {
      if (mountedRef.current) {
        setErrorState('productivity', error.message);
        console.error('❌ Erro ao carregar produtividade:', error);
      }
    } finally {
      if (mountedRef.current) {
        setLoadingState('productivity', false);
      }
    }
  }, [setLoadingState, setErrorState, setDataState]);

  const loadComparison = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoadingState('comparison', true);
    setErrorState('comparison', null);

    try {
      const comparisonData = await statsService.getComparisonStats();
      if (mountedRef.current) {
        setDataState('comparison', comparisonData);
      }
    } catch (error: any) {
      if (mountedRef.current) {
        setErrorState('comparison', error.message);
        console.error('❌ Erro ao carregar comparação:', error);
      }
    } finally {
      if (mountedRef.current) {
        setLoadingState('comparison', false);
      }
    }
  }, [setLoadingState, setErrorState, setDataState]);

  const loadDashboard = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoadingState('dashboard', true);
    setErrorState('dashboard', null);

    try {
      console.log('🚀 Carregando dados do dashboard em paralelo...');
      const dashboardData = await statsService.loadDashboardData();
      
      if (mountedRef.current) {
        setDataState('overview', dashboardData.overview);
        setDataState('tasks', dashboardData.tasks);
        setDataState('comparison', dashboardData.comparison);
        console.log('✅ Dashboard carregado com sucesso');
      }
    } catch (error: any) {
      if (mountedRef.current) {
        setErrorState('dashboard', error.message);
        console.error('❌ Erro ao carregar dashboard:', error);
      }
    } finally {
      if (mountedRef.current) {
        setLoadingState('dashboard', false);
      }
    }
  }, [setLoadingState, setErrorState, setDataState]);

  const loadAll = useCallback(async () => {
    if (!mountedRef.current) return;

    console.log('🚀 Carregando todas as estatísticas...');
    
    await Promise.allSettled([
      loadOverview(),
      loadTasks(),
      loadSummary(),
      loadComparison()
    ]);

    console.log('✅ Carregamento completo das estatísticas');
  }, [loadOverview, loadTasks, loadSummary, loadComparison]);

  // ========== FUNÇÕES DE UTILITÁRIO ==========

  const refresh = useCallback(async () => {
    console.log('🔄 Atualizando todas as estatísticas...');
    statsService.invalidateStatsCache();
    await loadAll();
  }, [loadAll]);

  const clearErrors = useCallback(() => {
    setErrors({
      overview: null,
      tasks: null,
      summary: null,
      productivity: null,
      comparison: null,
      dashboard: null,
    });
  }, []);

  const formatTime = useCallback((minutes: number) => formatFocusTime(minutes), []);

  const getPeriodData = useCallback((period: 'week' | 'month' | 'quarter' | 'year') => {
    return getPeriodDates(period);
  }, []);

  // ========== COMPUTED VALUES ==========

  const hasData = Object.values(data).some(value => value !== null);
  const hasErrors = Object.values(errors).some(error => error !== null);
  const isLoadingAny = Object.values(loading).some(isLoading => isLoading);

  // ========== CLEANUP ==========

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ========== RETURN ==========

  return {
    // Estados
    data,
    loading,
    errors,
    
    // Flags
    hasData,
    hasErrors,
    isLoadingAny,
    
    // Funções de carregamento
    loadOverview,
    loadTasks,
    loadSummary,
    loadProductivity,
    loadComparison,
    loadDashboard,
    loadAll,
    
    // Utilitários
    refresh,
    clearErrors,
    formatTime,
    getPeriodData,
  };
};

// ========== HOOKS ESPECIALIZADOS ==========

/**
 * Hook otimizado para dashboard (carrega dados essenciais)
 */
export const useStatsDashboard = () => {
  const {
    data: { overview, tasks, comparison },
    loading: { dashboard: isLoading },
    errors: { dashboard: error },
    loadDashboard,
    refresh
  } = useStats();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    overview,
    tasks,
    comparison,
    isLoading,
    error,
    refresh
  };
};

/**
 * Hook para métricas de overview com auto-refresh
 */
export const useStatsOverview = (autoRefresh: boolean = false) => {
  const {
    data: { overview },
    loading: { overview: isLoading },
    errors: { overview: error },
    loadOverview
  } = useStats();

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadOverview();
    }, 5 * 60 * 1000); // Refresh a cada 5 minutos

    return () => clearInterval(interval);
  }, [autoRefresh, loadOverview]);

  return {
    overview,
    isLoading,
    error,
    refresh: loadOverview
  };
};

/**
 * Hook para dados de produtividade com período customizado
 */
export const useStatsProductivity = (period: 'week' | 'month' | 'quarter' | 'year' = 'week') => {
  const {
    data: { productivity },
    loading: { productivity: isLoading },
    errors: { productivity: error },
    loadProductivity,
    getPeriodData
  } = useStats();

  const { startDate, endDate } = getPeriodData(period);

  useEffect(() => {
    loadProductivity(startDate, endDate);
  }, [loadProductivity, startDate, endDate]);

  return {
    productivity,
    isLoading,
    error,
    period,
    startDate,
    endDate,
    refresh: () => loadProductivity(startDate, endDate)
  };
};

// ========== EXPORT DEFAULT ==========

export default useStats; 