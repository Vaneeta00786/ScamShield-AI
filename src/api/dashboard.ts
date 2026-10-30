import { api } from './client';
import type { DashboardStats, WeeklyDataPoint } from '../types';
import type { RiskLevel } from '../types';

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  time: string;
  riskLevel: RiskLevel;
}

export function fetchDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>('/dashboard/stats');
}

export function fetchWeeklyData(): Promise<WeeklyDataPoint[]> {
  return api.get<WeeklyDataPoint[]>('/dashboard/weekly');
}

export function fetchAlerts(): Promise<AlertItem[]> {
  return api.get<AlertItem[]>('/dashboard/alerts');
}
