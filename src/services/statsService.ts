import apiClient from './api';

// ========== INTERFACES ==========

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
  startAt: string | null;
  endAt: string | null;
  column: {
    id: string;
    title: string;
    board: {
      id: string;
      title: string;
    };
  };
  _count: {
    pomodoros: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TasksByPeriod {
  today: Task[];
  week: Task[];
  month: Task[];
}

export interface PeriodMetrics {
  today: number;
  week: number;
  month: number;
}

export interface OverviewStats {
  pomodoros: PeriodMetrics;
  tasksCompleted: PeriodMetrics;
  focusTime: PeriodMetrics;
  productivity: PeriodMetrics;
}

export interface SummaryStats {
  totalPomodoros: number;
  totalTasksCompleted: number;
  totalFocusTime: number;
  averageProductivity: number;
  longestFocusStreak: number;
  mostProductiveDay: string | null;
}

export interface DailyProductivity {
  date: string;
  pomodoros: number;
  tasksCompleted: number;
  focusTime: number;
  productivity: number;
}

export interface ProductivityData {
  dailyData: DailyProductivity[];
  summary: {
    totalPomodoros: number;
    totalTasksCompleted: number;
    totalFocusTime: number;
    averageProductivity: number;
  };
}

export interface ComparisonMetric {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

export interface ComparisonStats {
  pomodoros: ComparisonMetric;
  tasksCompleted: ComparisonMetric;
  productivity: ComparisonMetric;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// ========== CACHE STRATEGIES ==========

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_STRATEGIES = {
  overview: 5 * 60 * 1000,      // 5 minutos
  summary: 60 * 60 * 1000,      // 1 hora
  tasks: 2 * 60 * 1000,         // 2 minutos
  productivity: 10 * 60 * 1000,  // 10 minutos
  comparison: 30 * 60 * 1000     // 30 minutos
};

const cache = new Map<string, CacheItem<any>>();

const getCachedData = <T>(key: string, maxAge: number): T | null => {
  const item = cache.get(key);
  if (item && (Date.now() - item.timestamp) < maxAge) {
    return item.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

const invalidateCache = (pattern?: string): void => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

// ========== HELPER FUNCTIONS ==========

const fetchWithRetry = async <T>(
  url: string,
  maxRetries: number = 3
): Promise<ApiResponse<T>> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiClient.get<ApiResponse<T>>(url);
      
      if (response.data.success) {
        return response.data;
      }
      
      throw new Error(response.data.error?.message || 'Unknown error');
    } catch (error: any) {
      console.error(`Tentativa ${i + 1} falhou para ${url}:`, error.message);
      
      if (i === maxRetries - 1) {
        throw new Error(`Falha após ${maxRetries} tentativas: ${error.message}`);
      }
      
      // Aguarda antes de tentar novamente (backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error('Erro inesperado no fetchWithRetry');
};

// ========== MAIN SERVICE FUNCTIONS ==========

/**
 * 1. GET /api/v1/stats/tasks
 * Buscar tarefas organizadas por período (hoje, semana, mês)
 */
export const getTasksByPeriod = async (
  includeIncomplete: boolean = false
): Promise<TasksByPeriod> => {
  const cacheKey = `tasks-${includeIncomplete}`;
  const cached = getCachedData<TasksByPeriod>(cacheKey, CACHE_STRATEGIES.tasks);
  
  if (cached) {
    console.log('📋 Tarefas carregadas do cache');
    return cached;
  }

  try {
    console.log('📋 Buscando tarefas por período...');
    
    const params = new URLSearchParams();
    if (includeIncomplete) {
      params.append('includeIncomplete', 'true');
    }
    
    const url = `/stats/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetchWithRetry<TasksByPeriod>(url);
    
    if (response.data) {
      setCachedData(cacheKey, response.data);
      console.log('✅ Tarefas carregadas com sucesso');
      return response.data;
    }
    
    throw new Error('Dados de tarefas inválidos');
  } catch (error: any) {
    console.error('❌ Erro ao buscar tarefas:', error.message);
    throw new Error(`Falha ao carregar tarefas: ${error.message}`);
  }
};

/**
 * 2. GET /api/v1/stats/overview
 * Métricas rápidas de produtividade por período
 */
export const getOverviewStats = async (): Promise<OverviewStats> => {
  const cacheKey = 'overview';
  const cached = getCachedData<OverviewStats>(cacheKey, CACHE_STRATEGIES.overview);
  
  if (cached) {
    console.log('📊 Overview carregado do cache');
    return cached;
  }

  try {
    console.log('📊 Buscando métricas de overview...');
    
    const response = await fetchWithRetry<OverviewStats>('/stats/overview');
    
    if (response.data) {
      setCachedData(cacheKey, response.data);
      console.log('✅ Overview carregado com sucesso');
      return response.data;
    }
    
    throw new Error('Dados de overview inválidos');
  } catch (error: any) {
    console.error('❌ Erro ao buscar overview:', error.message);
    throw new Error(`Falha ao carregar overview: ${error.message}`);
  }
};

/**
 * 3. GET /api/v1/stats/summary
 * Estatísticas históricas e conquistas do usuário
 */
export const getSummaryStats = async (): Promise<SummaryStats> => {
  const cacheKey = 'summary';
  const cached = getCachedData<SummaryStats>(cacheKey, CACHE_STRATEGIES.summary);
  
  if (cached) {
    console.log('🏆 Summary carregado do cache');
    return cached;
  }

  try {
    console.log('🏆 Buscando estatísticas de summary...');
    
    const response = await fetchWithRetry<SummaryStats>('/stats/summary');
    
    if (response.data) {
      setCachedData(cacheKey, response.data);
      console.log('✅ Summary carregado com sucesso');
      return response.data;
    }
    
    throw new Error('Dados de summary inválidos');
  } catch (error: any) {
    console.error('❌ Erro ao buscar summary:', error.message);
    throw new Error(`Falha ao carregar summary: ${error.message}`);
  }
};

/**
 * 4. GET /api/v1/stats/productivity
 * Dados detalhados para gráficos e análises
 */
export const getProductivityData = async (
  startDate: string,
  endDate: string
): Promise<ProductivityData> => {
  // Validar formato de data
  if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
    throw new Error('Formato de data inválido. Use YYYY-MM-DD');
  }
  
  if (new Date(endDate) < new Date(startDate)) {
    throw new Error('Data de fim deve ser posterior à data de início');
  }
  
  const cacheKey = `productivity-${startDate}-${endDate}`;
  const cached = getCachedData<ProductivityData>(cacheKey, CACHE_STRATEGIES.productivity);
  
  if (cached) {
    console.log('📈 Produtividade carregada do cache');
    return cached;
  }

  try {
    console.log('📈 Buscando dados de produtividade...');
    
    const params = new URLSearchParams({
      startDate,
      endDate
    });
    
    const response = await fetchWithRetry<ProductivityData>(`/stats/productivity?${params.toString()}`);
    
    if (response.data) {
      setCachedData(cacheKey, response.data);
      console.log('✅ Produtividade carregada com sucesso');
      return response.data;
    }
    
    throw new Error('Dados de produtividade inválidos');
  } catch (error: any) {
    console.error('❌ Erro ao buscar produtividade:', error.message);
    throw new Error(`Falha ao carregar produtividade: ${error.message}`);
  }
};

/**
 * 5. GET /api/v1/stats/comparison
 * Comparação entre semana atual e anterior
 */
export const getComparisonStats = async (): Promise<ComparisonStats> => {
  const cacheKey = 'comparison';
  const cached = getCachedData<ComparisonStats>(cacheKey, CACHE_STRATEGIES.comparison);
  
  if (cached) {
    console.log('🔄 Comparação carregada do cache');
    return cached;
  }

  try {
    console.log('🔄 Buscando dados de comparação...');
    
    const response = await fetchWithRetry<ComparisonStats>('/stats/comparison');
    
    if (response.data) {
      setCachedData(cacheKey, response.data);
      console.log('✅ Comparação carregada com sucesso');
      return response.data;
    }
    
    throw new Error('Dados de comparação inválidos');
  } catch (error: any) {
    console.error('❌ Erro ao buscar comparação:', error.message);
    throw new Error(`Falha ao carregar comparação: ${error.message}`);
  }
};

// ========== UTILITY FUNCTIONS ==========

const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date) && !isNaN(Date.parse(date));
};

/**
 * Carregamento paralelo para dashboard
 */
export const loadDashboardData = async () => {
  try {
    console.log('🚀 Carregando dados do dashboard...');
    
    const [overview, recentTasks, comparison] = await Promise.all([
      getOverviewStats(),
      getTasksByPeriod(false),
      getComparisonStats()
    ]);
    
    console.log('✅ Todos os dados do dashboard carregados');
    
    return {
      overview,
      tasks: recentTasks,
      comparison
    };
  } catch (error: any) {
    console.error('❌ Erro no carregamento do dashboard:', error.message);
    throw error;
  }
};

/**
 * Gerar datas para período específico
 */
export const getPeriodDates = (period: 'week' | 'month' | 'quarter' | 'year') => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  
  let startDate: Date;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'quarter':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate
  };
};

/**
 * Formatação de tempo focado
 */
export const formatFocusTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Invalidar cache após ações
 */
export const invalidateStatsCache = (action?: 'task' | 'pomodoro' | 'all'): void => {
  console.log(`🗑️ Invalidando cache de stats: ${action || 'all'}`);
  
  switch (action) {
    case 'task':
      invalidateCache('tasks');
      invalidateCache('overview');
      invalidateCache('comparison');
      break;
    case 'pomodoro':
      invalidateCache('overview');
      invalidateCache('productivity');
      invalidateCache('comparison');
      break;
    default:
      invalidateCache();
  }
};

// ========== EXPORT DEFAULT ==========

const statsService = {
  getTasksByPeriod,
  getOverviewStats,
  getSummaryStats,
  getProductivityData,
  getComparisonStats,
  loadDashboardData,
  getPeriodDates,
  formatFocusTime,
  invalidateStatsCache
};

export default statsService; 