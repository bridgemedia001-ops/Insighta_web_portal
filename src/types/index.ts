          
          export interface User {
  id: string;
  github_id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: 'ADMIN' | 'ANALYST';
  is_active: boolean;
  last_login_at: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export interface ProfilePageResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links: {
    self: string;
    next?: string;
    prev?: string;
  };
  data: Profile[];
}

export interface TokenResponse {
  status: string;
  access_token: string;
  refresh_token: string;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Filters {
  gender?: string;
  country_id?: string;
  age_group?: string;
  min_age?: number;
  max_age?: number;
  min_country_probability?: number;
  min_gender_probability?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
