import { api } from './client';
import type { ScanResult } from '../types';

export interface AnalyzeRequest {
  inputType: 'job_post' | 'chat' | 'offer_letter';
  text: string;
  companyName?: string;
  jobUrl?: string;
  platform?: string;
}

export function analyzeContent(body: AnalyzeRequest): Promise<ScanResult> {
  return api.post<ScanResult>('/analyze', body);
}
