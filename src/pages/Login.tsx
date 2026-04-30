import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Github } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<string>('');
  const [codeVerifier, setCodeVerifier] = useState<string>('');
  const [codeChallenge, setCodeChallenge] = useState<string>('');

  useEffect(() => {
    // Generate PKCE parameters on mount
    const generatePKCE = async () => {
      const state = generateRandomString(32);
      const codeVerifier = generateRandomString(32);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      setState(state);
      setCodeVerifier(codeVerifier);
      setCodeChallenge(codeChallenge);
    };

    generatePKCE();

    // Check if we're returning from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const returnedState = urlParams.get('state');

    if (code && returnedState) {
      handleOAuthCallback(code, returnedState);
    }
  }, []);

  const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateCodeChallenge = async (verifier: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const handleOAuthCallback = async (code: string, returnedState: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (returnedState !== state) {
        throw new Error('State mismatch. Possible CSRF attack.');
      }

      const response = await apiService.exchangeCodeForTokens(code, returnedState, codeVerifier);

      // For now, we'll decode the JWT to get user info
      // In production, you might want to call a /me endpoint
      const userPayload = parseJWT(response.access_token);

      const user = {
        id: userPayload.sub,
        github_id: userPayload.github_id,
        username: userPayload.username,
        email: userPayload.email || '',
        avatar_url: userPayload.avatar_url || '',
        role: userPayload.role,
        is_active: true,
        last_login_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      login(response, user);

      // Clear URL params
      window.history.replaceState({}, document.title, '/dashboard');
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const parseJWT = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const authUrl = await apiService.initiateGitHubOAuth(state, codeChallenge);
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">I</span>
          </div>
          <CardTitle className="text-2xl">Welcome to Insighta+</CardTitle>
          <p className="text-gray-600 mt-2">Sign in with your GitHub account to continue</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              className="w-full"
              size="lg"
              disabled={!state || !codeChallenge}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
