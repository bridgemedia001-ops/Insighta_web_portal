import React from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LogIn } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://insightiabackend-production.up.railway.app';

export const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/github?source=web`;
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
          <Button
            onClick={handleLogin}
            className="w-full"
            size="lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
