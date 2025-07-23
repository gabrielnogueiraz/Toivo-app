// ========== GRÁFICOS E VISUALIZAÇÕES ==========

export { default as ProductivityChart } from './ProductivityChart';
export { default as ComparisonChart } from './ComparisonChart';
export { default as OverviewMetrics } from './OverviewMetrics';

// ========== TIPOS E INTERFACES ==========

export type { 
  OverviewStats,
  ComparisonStats, 
  DailyProductivity,
  ProductivityData,
  TasksByPeriod,
  SummaryStats
} from '../../services/statsService'; 