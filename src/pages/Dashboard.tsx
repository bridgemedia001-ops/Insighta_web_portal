import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Users, TrendingUp, Clock, Activity } from 'lucide-react';
import type { Profile } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalProfiles: 0,
    recentProfiles: [] as Profile[],
    genderDistribution: { male: 0, female: 0 },
    topCountries: [] as { name: string; count: number }[],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const profiles = await apiService.getProfiles({ limit: 50 });
      const recentProfiles = profiles.data.slice(0, 5);

      // Calculate gender distribution
      const genderDist = profiles.data.reduce(
        (acc, profile) => {
          if (profile.gender === 'male') acc.male++;
          if (profile.gender === 'female') acc.female++;
          return acc;
        },
        { male: 0, female: 0 }
      );

      // Calculate top countries
      const countryCount = profiles.data.reduce((acc, profile) => {
        acc[profile.country_name] = (acc[profile.country_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCountries = Object.entries(countryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setMetrics({
        totalProfiles: profiles.total,
        recentProfiles,
        genderDistribution: genderDist,
        topCountries,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProfiles.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Profiles in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Male Profiles</CardTitle>
            <Activity className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.genderDistribution.male}</div>
            <p className="text-xs text-gray-500">
              {((metrics.genderDistribution.male / metrics.totalProfiles) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Female Profiles</CardTitle>
            <Activity className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.genderDistribution.female}</div>
            <p className="text-xs text-gray-500">
              {((metrics.genderDistribution.female / metrics.totalProfiles) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Your Role</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.role?.toLowerCase()}</div>
            <p className="text-xs text-gray-500">
              {isAdmin ? 'Full access to all features' : 'Read-only access'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.recentProfiles.length === 0 ? (
                <p className="text-gray-500 text-sm">No profiles yet</p>
              ) : (
                metrics.recentProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => navigate(`/profiles/${profile.id}`)}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{profile.name}</p>
                      <p className="text-sm text-gray-500">
                        {profile.gender} • {profile.country_name} • {profile.age} years old
                      </p>
                    </div>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                ))
              )}
            </div>
            {metrics.recentProfiles.length > 0 && (
              <button
                onClick={() => navigate('/profiles')}
                className="w-full mt-4 text-sm text-primary hover:underline"
              >
                View all profiles →
              </button>
            )}
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topCountries.length === 0 ? (
                <p className="text-gray-500 text-sm">No data available</p>
              ) : (
                metrics.topCountries.map((country, index) => (
                  <div key={country.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-gray-900">{country.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{country.count}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Admin */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/profiles?action=create')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Create New Profile
              </button>
              <button
                onClick={() => navigate('/profiles?action=export')}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
              >
                Export Profiles
              </button>
              <button
                onClick={() => navigate('/search')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Search Profiles
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
