import { api } from './client';

export interface ReportRequest {
  scamType: string;
  companyName: string;
  platform: string;
  description: string;
}

export interface ReportResponse {
  success: boolean;
  reportId: string;
  message: string;
}

export function submitReport(body: ReportRequest): Promise<ReportResponse> {
  return api.post<ReportResponse>('/report', body);
}
