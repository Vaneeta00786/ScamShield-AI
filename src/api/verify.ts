import { api } from './client';
import type { CompanyVerificationResult } from '../types';

export interface VerifyRequest {
  companyName: string;
  cin?: string;
  website?: string;
}

export function verifyCompany(body: VerifyRequest): Promise<CompanyVerificationResult> {
  return api.post<CompanyVerificationResult>('/verify', body);
}
