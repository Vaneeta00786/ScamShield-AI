import { api } from './client';
import type { RadarReport } from '../types';

export function getRadarReports(): Promise<RadarReport[]> {
  return api.get<RadarReport[]>('/radar');
}

export function submitRadarReport(data: {
  scamType: string;
  platform: string;
  location: string;
  description: string;
}): Promise<RadarReport> {
  return api.post<RadarReport>('/radar/submit', data);
}

export function upvoteReport(id: string): Promise<RadarReport> {
  return api.post<RadarReport>(`/radar/upvote/${id}`, {});
}
