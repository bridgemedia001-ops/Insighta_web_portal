import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ErrorResponse, ProfilePageResponse, Profile, Filters, User } from '../types';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://insightiabackend-production.up.railway.app';

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for API version header
    this.client.interceptors.request.use(
      (config) => {
        config.headers['X-API-Version'] = '1';
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.client.post('/auth/refresh');
            return this.client(originalRequest);
          } catch (refreshError) {
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  // Profile endpoints
  async getProfiles(filters: Filters = {}): Promise<ProfilePageResponse> {
    const response = await this.client.get<ProfilePageResponse>('/api/profiles', {
      params: filters,
    });
    return response.data;
  }

  async getProfileById(id: string): Promise<Profile> {
    const response = await this.client.get<{ status: string; data: Profile }>(`/api/profiles/${id}`);
    return response.data.data;
  }

  async searchProfiles(query: string, page: number = 1, limit: number = 10): Promise<ProfilePageResponse> {
    const response = await this.client.get<ProfilePageResponse>('/api/profiles/search', {
      params: { q: query, page, limit },
    });
    return response.data;
  }

  async createProfile(name: string): Promise<Profile> {
    const response = await this.client.post<{ status: string; data: Profile }>('/api/profiles', { name });
    return response.data.data;
  }

  async deleteProfile(id: string): Promise<void> {
    await this.client.delete(`/api/profiles/${id}`);
  }

  async exportProfiles(filters: Filters = {}): Promise<Blob> {
    const response = await this.client.get('/api/profiles/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<string> {
    const response = await this.client.get<string>('/');
    return response.data;
  }
}

export const apiService = new APIService();
