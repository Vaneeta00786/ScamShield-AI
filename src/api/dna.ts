import { api } from './client';
import type { DnaAnalysisResult } from '../types';

export function analyzeBehavior(text: string): Promise<DnaAnalysisResult> {
  return api.post<DnaAnalysisResult>('/dna', { text });
}
