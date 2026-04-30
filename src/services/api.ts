import axios, { AxiosInstance, AxiosError } from 'axios';
import type { TokenResponse, ErrorResponse, ProfilePageResponse, Profile, Filters } from '../types';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://insightiabackend-production.up.railway.app';

class APIService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load tokens from localStorage on init
    this.loadTokens();

    // Request interceptor to add auth header
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
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
          if (this.refreshToken) {
            try {
              const newTokens = await this.refreshAccessToken(this.refreshToken);
              this.setTokens(newTokens.access_token, newTokens.refresh_token);
              originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              this.clearTokens();
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          } else {
            this.clearTokens();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private loadTokens() {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Auth endpoints
  async initiateGitHubOAuth(state: string, codeChallenge: string): Promise<string> {
    const params = new URLSearchParams({
      state,
      code_challenge: codeChallenge,
    });
    return `${BASE_URL}/auth/github?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, state: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await this.client.get<TokenResponse>('/auth/github/callback', {
      params: { code, state, code_verifier: codeVerifier },
    });
    return response.data;
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.client.post('/auth/logout', {
      refresh_token: refreshToken,
    });
    this.clearTokens();
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
