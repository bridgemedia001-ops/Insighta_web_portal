import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, Plus } from 'lucide-react';

export const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profile = await apiService.createProfile(name.trim());
      navigate(`/profiles/${profile.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/profiles')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Profile</h1>
          <p className="text-gray-600 mt-1">Add a new profile to the database</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name (e.g., John Doe)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                The system will automatically fetch gender, age, and country information from external APIs
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Creating...' : 'Create Profile'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profiles')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enter a name in the field above</li>
            <li>The system calls external APIs to predict gender, age, and country</li>
            <li>The profile is automatically created with all the fetched information</li>
            <li>You can view, edit, or delete the profile from the profiles list</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
