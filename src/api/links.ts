import { api } from './client';
import type { LinkInspectionResult } from '../types';

export function inspectLink(url: string): Promise<LinkInspectionResult> {
  return api.post<LinkInspectionResult>('/links', { url });
}
