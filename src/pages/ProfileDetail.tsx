import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, User, MapPin, Calendar, Trash2 } from 'lucide-react';
import type { Profile } from '../types';

export const ProfileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (profileId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getProfileById(profileId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiService.deleteProfile(id!);
      navigate('/profiles');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete profile');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Profile not found'}</p>
        <Button onClick={() => navigate('/profiles')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/profiles')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profiles</span>
        </Button>
        {isAdmin && (
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Profile'}</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-3xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl">{profile.name}</CardTitle>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span className="capitalize">{profile.gender}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{profile.age} years old</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.country_name}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Gender Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Gender</span>
                    <span className="font-medium capitalize">{profile.gender}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Probability</span>
                    <span className="font-medium">{(profile.gender_probability * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Age Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Age</span>
                    <span className="font-medium">{profile.age}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Age Group</span>
                    <span className="font-medium capitalize">{profile.age_group}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Country Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Country</span>
                    <span className="font-medium">{profile.country_name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Country Code</span>
                    <span className="font-medium">{profile.country_id}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Probability</span>
                    <span className="font-medium">{(profile.country_probability * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Profile Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Profile ID</span>
                    <span className="font-medium text-sm">{profile.id}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Created At</span>
                    <span className="font-medium">{new Date(profile.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
