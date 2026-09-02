import apiClient, { type SingleResponse } from '../client';

export interface UserCertificateData {
  id: string;
  certificateHash: string;
  trackName: string;
  scorePercent: number;
  issuedAt: string;
  user: { id: string; name: string; email: string; avatar: string };
}

export const certificatesApi = {
  getById: (id: string) => apiClient.get<SingleResponse<UserCertificateData>>(`/api/certificates/${id}`),
};
