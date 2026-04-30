import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (tokens: { access_token: string; refresh_token: string }, user: User) => void;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if tokens exist on mount
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('user');

    if (accessToken && refreshToken && userData) {
      try {
        const user = JSON.parse(userData);
        apiService.setTokens(accessToken, refreshToken);
        setAuthState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        setAuthState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = (tokens: { access_token: string; refresh_token: string }, user: User) => {
    apiService.setTokens(tokens.access_token, tokens.refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      user,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = async () => {
    if (authState.refreshToken) {
      try {
        await apiService.logout(authState.refreshToken);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const refreshTokens = async () => {
    if (authState.refreshToken) {
      try {
        const newTokens = await apiService.refreshAccessToken(authState.refreshToken);
        apiService.setTokens(newTokens.access_token, newTokens.refresh_token);
        setAuthState((prev) => ({
          ...prev,
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
        }));
      } catch (error) {
        console.error('Token refresh error:', error);
        await logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        refreshTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
