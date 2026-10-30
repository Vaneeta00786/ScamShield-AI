import { api } from './client';
import type { CoachResponse } from '../types';

export function askCoach(question: string): Promise<CoachResponse> {
  return api.post<CoachResponse>('/coach', { question });
}
