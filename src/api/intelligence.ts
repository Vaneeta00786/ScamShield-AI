import { api } from './client';
import type { ScamPattern } from '../types';

export function fetchScamPatterns(): Promise<ScamPattern[]> {
  return api.get<ScamPattern[]>('/intelligence/patterns');
}
